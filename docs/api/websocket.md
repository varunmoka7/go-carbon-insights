# WebSocket API Documentation

The Forum Service provides real-time WebSocket communication for instant updates on topics, replies, reports, and moderation actions.

## Connection

### Endpoint
```
ws://localhost:3001/ws
```

### Namespaces
- `/forum` - For regular users (topics, replies, moderation notifications)
- `/admin` - For admin/moderator users (reports, admin metrics)

### Authentication
WebSocket connections require JWT authentication passed in the handshake:

```javascript
const socket = io('ws://localhost:3001/forum', {
  path: '/ws',
  auth: {
    token: 'your-jwt-token'
  }
});
```

## Events

### Client-to-Server Events

#### `join:room`
Join a specific room for targeted updates.

**Payload:**
```typescript
room: string // Room identifier
```

**Valid Room Patterns:**
- `forum:global` - Global forum updates
- `admin:global` - Admin updates
- `topic:{uuid}` - Specific topic updates
- `category:{uuid}` - Category-specific updates
- `user:{uuid}` - User-specific updates

**Example:**
```javascript
socket.emit('join:room', 'topic:123e4567-e89b-12d3-a456-426614174000');
```

#### `leave:room`
Leave a specific room.

**Payload:**
```typescript
room: string // Room identifier
```

**Example:**
```javascript
socket.emit('leave:room', 'topic:123e4567-e89b-12d3-a456-426614174000');
```

### Server-to-Client Events

#### `topic:created`
Emitted when a new topic is created.

**Payload:**
```typescript
interface TopicCreatedPayload {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  authorId: string;
  authorUsername: string;
  createdAt: string;
  timestamp: string;
  userId?: string;
}
```

**Example:**
```javascript
socket.on('topic:created', (data) => {
  console.log(`New topic: ${data.title} by ${data.authorUsername}`);
  // Update UI with new topic
});
```

#### `reply:created`
Emitted when a new reply is posted.

**Payload:**
```typescript
interface ReplyCreatedPayload {
  id: string;
  topicId: string;
  topicTitle: string;
  content: string;
  authorId: string;
  authorUsername: string;
  parentId?: string;
  createdAt: string;
  timestamp: string;
  userId?: string;
}
```

**Example:**
```javascript
socket.on('reply:created', (data) => {
  console.log(`New reply in "${data.topicTitle}" by ${data.authorUsername}`);
  // Update topic view with new reply
});
```

#### `report:created`
Emitted when content is reported (admin namespace only).

**Payload:**
```typescript
interface ReportCreatedPayload {
  id: string;
  contentType: 'topic' | 'reply';
  contentId: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'copyright' | 'other';
  reporterId?: string;
  createdAt: string;
  timestamp: string;
  userId?: string;
}
```

**Example:**
```javascript
socket.on('report:created', (data) => {
  console.log(`New ${data.contentType} reported for ${data.reason}`);
  // Update admin dashboard
});
```

#### `moderation:action`
Emitted when a moderation action is taken.

**Payload:**
```typescript
interface ModerationActionPayload {
  id: string;
  actionType: 'delete' | 'hide' | 'suspend' | 'warn' | 'pin' | 'unpin' | 'lock' | 'unlock' | 'restore';
  targetType: 'topic' | 'reply' | 'user';
  targetId: string;
  moderatorId: string;
  moderatorUsername: string;
  reason?: string;
  createdAt: string;
  timestamp: string;
  userId?: string;
}
```

**Example:**
```javascript
socket.on('moderation:action', (data) => {
  console.log(`Moderation: ${data.actionType} by ${data.moderatorUsername}`);
  // Update UI based on moderation action
});
```

#### `user:suspension`
Emitted when a user is suspended or unsuspended.

**Payload:**
```typescript
interface UserSuspensionPayload {
  userId: string;
  username: string;
  suspended: boolean;
  reason?: string;
  duration?: string;
  timestamp: string;
}
```

**Example:**
```javascript
socket.on('user:suspension', (data) => {
  if (data.suspended) {
    console.log(`User ${data.username} suspended: ${data.reason}`);
  } else {
    console.log(`User ${data.username} unsuspended`);
  }
});
```

#### `error`
Emitted when an error occurs.

**Payload:**
```typescript
interface ErrorPayload {
  message: string;
  code?: string;
}
```

**Example:**
```javascript
socket.on('error', (error) => {
  console.error('WebSocket error:', error.message);
});
```

## Rate Limiting

WebSocket connections are rate-limited to prevent abuse:

- **Events per second**: 10
- **Events per minute**: 100
- **Room joins per minute**: 20

Exceeding these limits will result in connection termination.

## Connection Management

### Auto-reconnection
The client should implement auto-reconnection logic:

```javascript
const socket = io('ws://localhost:3001/forum', {
  path: '/ws',
  auth: { token: 'your-jwt-token' },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
```

### Heartbeat
Socket.IO handles heartbeat automatically. No manual ping/pong required.

### Error Handling
Always handle connection errors gracefully:

```javascript
socket.on('connect_error', (error) => {
  if (error.message.includes('Authentication')) {
    // Refresh token and reconnect
    refreshAuthToken().then(newToken => {
      socket.auth.token = newToken;
      socket.connect();
    });
  }
});
```

## React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (namespace = '/forum') => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    const newSocket = io(`ws://localhost:3001${namespace}`, {
      path: '/ws',
      auth: { token },
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join:room', 'forum:global');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('topic:created', (data) => {
      // Handle new topic
      console.log('New topic:', data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [namespace]);

  return { socket, isConnected };
};
```

## Scaling with Redis

For multi-instance deployments, configure Redis adapter:

```bash
# Environment variables
WS_ADAPTER=redis
REDIS_URL=redis://localhost:6379
```

The WebSocket server will automatically use Redis for pub/sub when configured.

## Security

### Authentication
- JWT tokens are validated on connection and periodically re-validated
- Invalid or expired tokens result in immediate disconnection

### Authorization
- Admin namespace requires admin or moderator role
- Users can only join rooms they have access to
- Rate limiting prevents abuse

### Data Validation
- All room names are validated against allowed patterns
- Event payloads are sanitized and validated
- Malicious or malformed data is rejected

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify JWT token is valid and not expired
   - Ensure user account is active
   - Check token format in auth header

2. **Connection Timeout**
   - Check network connectivity
   - Verify WebSocket endpoint is accessible
   - Try different transport (polling fallback)

3. **Room Join Failed**
   - Ensure room name follows valid patterns
   - Check user permissions for private rooms
   - Verify UUID format for entity-specific rooms

4. **Events Not Received**
   - Confirm client is in the correct room
   - Check event listener registration
   - Verify server-side event emission

### Debug Mode

Enable debug logging:

```javascript
localStorage.debug = 'socket.io-client:socket';
```

This will show detailed connection and event logs in the browser console.
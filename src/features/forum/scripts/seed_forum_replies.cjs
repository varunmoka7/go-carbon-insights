require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const GCT_TEAM_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

// Load the generated posts
const posts = JSON.parse(fs.readFileSync('forum_posts.json', 'utf8'));

// Example replies for seeding
const exampleReplies = [
  "Great question! Here's how you can approach this...",
  "Thanks for sharing. I recommend looking into...",
  "This is a common challenge. One solution is...",
  "Excellent point! To add, you might consider...",
  "Here's a resource that might help: ..."
];

async function getTopicIdByTitle(title) {
  const { data, error } = await supabase
    .from('community_topics')
    .select('id')
    .eq('title', title)
    .single();
  if (error || !data) {
    console.error(`Topic not found: ${title}`);
    return null;
  }
  return data.id;
}

async function seedReplies() {
  for (const post of posts) {
    const topicId = await getTopicIdByTitle(post.title);
    if (!topicId) continue;

    // Seed 2-3 replies per topic
    for (let i = 0; i < 3; i++) {
      const isExpert = i === 0; // First reply is accepted/expert answer
      const { error, data } = await supabase
        .from('community_replies')
        .insert({
          content: exampleReplies[(i + Math.floor(Math.random() * exampleReplies.length)) % exampleReplies.length],
          topic_id: topicId,
          author_id: GCT_TEAM_USER_ID,
          is_expert_answer: isExpert
        })
        .select()
        .single();
      if (error) {
        console.error(`Failed to insert reply for topic ${post.title}:`, error.message);
      } else {
        console.log(`Inserted reply for topic "${post.title}" (ID: ${data.id})${isExpert ? ' [ACCEPTED]' : ''}`);
      }
    }
  }
}

seedReplies(); 
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load your Supabase credentials from environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// The user ID for "GoCarbonTracker Team" (from migration seed)
const GCT_TEAM_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

// Load the generated posts
const posts = JSON.parse(fs.readFileSync('forum_posts.json', 'utf8'));

async function getCategoryIdByName(name) {
  const { data, error } = await supabase
    .from('community_categories')
    .select('id')
    .eq('name', name)
    .single();
  if (error || !data) {
    console.error(`Category not found: ${name}`);
    return null;
  }
  return data.id;
}

async function seedPosts() {
  for (const post of posts) {
    const categoryId = await getCategoryIdByName(post.category);
    if (!categoryId) continue;

    const { error, data } = await supabase
      .from('community_topics')
      .insert({
        title: post.title,
        content: post.content,
        category_id: categoryId,
        author_id: GCT_TEAM_USER_ID,
        tags: post.tags,
        is_pinned: true
      })
      .select()
      .single();

    if (error) {
      console.error(`Failed to insert post for category ${post.category}:`, error.message);
    } else {
      console.log(`Inserted post "${post.title}" in category "${post.category}" (ID: ${data.id})`);
    }
  }
}

seedPosts(); 
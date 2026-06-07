const { createClient } = require('@supabase/supabase-js');

const url = 'https://riaggsacrxhvindypfnp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYWdnc2FjcnhodmluZHlwZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjE3MjAsImV4cCI6MjA5NjQzNzcyMH0.avQqm9U2qg-xZ9hdeVvb0rbRXUKiHuKpUBlYKd29FIs';

const supabase = createClient(url, key);

async function test() {
  console.log("Testing connection...");
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("Supabase Error:", error);
  } else {
    console.log("Connection Success! Users fetched:", data.length);
    console.log(data);
  }
}

test();

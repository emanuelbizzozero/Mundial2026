const { createClient } = require('@supabase/supabase-js');

const url = 'https://riaggsacrxhvindypfnp.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJpYWdnc2FjcnhodmluZHlwZm5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjE3MjAsImV4cCI6MjA5NjQzNzcyMH0.avQqm9U2qg-xZ9hdeVvb0rbRXUKiHuKpUBlYKd29FIs';
const supabase = createClient(url, key);

async function testInsert() {
  const newUser = {
    username: 'testuser' + Math.random(),
    password: '123',
    name: 'Test',
    last_name: 'User',
    dni: '',
    phone: '123456',
    email: 'test' + Math.random() + '@test.com',
    status: 'PENDIENTE',
    role: 'user'
  };
  const { data, error } = await supabase.from('users').insert([newUser]).select();
  if (error) {
    console.error("Supabase insert error:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success:", data);
  }
}

testInsert();

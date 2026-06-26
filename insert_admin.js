const supabaseUrl = 'https://vtutbqzkegkgujrdkxmj.supabase.co';
const supabaseKey = 'sb_publishable_H3CvN9upPS-sZmDYqUuCsQ_7SV1HBgu';

async function run() {
  const url = `${supabaseUrl}/rest/v1/admins`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        admin_id: 'ADMIN-001',
        full_name: 'System Admin',
        email: 'admin@dremora.com',
        password_hash: '$2a$10$f/2296T8/M3g3Uv2K0eY0On.sI.lD2uS.1a92aM3hKkXnL2l8Y4R6', // 'admin'
        role: 'admin'
      })
    });
    
    if (!response.ok) {
        console.error("HTTP error", response.status, response.statusText);
        const text = await response.text();
        console.error(text);
        return;
    }
    
    const data = await response.json();
    console.log('Inserted Admin:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();

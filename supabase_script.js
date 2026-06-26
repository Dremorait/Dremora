const supabaseUrl = 'https://vtutbqzkegkgujrdkxmj.supabase.co';
const supabaseKey = 'sb_publishable_H3CvN9upPS-sZmDYqUuCsQ_7SV1HBgu';

async function run() {
  const url = `${supabaseUrl}/rest/v1/interns?intern_id=eq.DRM-INT-2026-001`;
  
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        photo: 'assets/images/krushna_bhadale.png'
      })
    });
    
    if (!response.ok) {
        console.error("HTTP error", response.status, response.statusText);
        const text = await response.text();
        console.error(text);
        return;
    }
    
    const data = await response.json();
    console.log('Update Success:', data);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

run();

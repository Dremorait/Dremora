const supabaseUrl = 'https://vtutbqzkegkgujrdkxmj.supabase.co';
const supabaseKey = 'sb_publishable_H3CvN9upPS-sZmDYqUuCsQ_7SV1HBgu';

async function run() {
  const url = `${supabaseUrl}/rest/v1/admins?select=*&limit=1`;
  try {
    const res = await fetch(url, { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }});
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
run();

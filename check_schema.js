const supabaseUrl = 'https://vtutbqzkegkgujrdkxmj.supabase.co';
const supabaseKey = 'sb_publishable_H3CvN9upPS-sZmDYqUuCsQ_7SV1HBgu';

async function run() {
  const url = `${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(Object.keys(data.definitions || {}));
  } catch (err) {
    console.error(err);
  }
}
run();

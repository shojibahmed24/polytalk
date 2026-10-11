const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const pwd = encodeURIComponent('JibOn@786400');
  const connStr = `postgresql://postgres.vzlmrzxdwsslbzoeulnw:${pwd}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`;
  const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240102000000_coach_scenarios_and_sessions.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Applying migration...');
    await client.query(sql);
    console.log('Migration applied successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'coach_%';
    `);
    console.log('Created coach tables:', res.rows.map(r => r.table_name));

    const scenarios = await client.query('SELECT id, title, category FROM public.coach_scenarios;');
    console.log('Seeded scenarios:', scenarios.rows);

  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

/*
# Titans Website — scrims table and site settings

## Purpose
Creates the data layer for the Titans Website. The site is a single-tenant
public site (no sign-in), so data is intentionally shared/public and policies
are scoped to `anon, authenticated` so the anon-key frontend can read everything.

## New Tables
- `scrims`
  - `id` (uuid, primary key)
  - `opponent` (text, not null) — name of the opposing team/scrims partner
  - `date` (timestamptz, not null) — scheduled scrim date/time
  - `format` (text, not null) — e.g. "Best of 3", "Best of 5"
  - `location` (text) — optional venue or "Online"
  - `result` (text) — optional outcome ("Win", "Loss", "TBD")
  - `notes` (text) — optional extra notes
  - `created_at` (timestamptz, default now())
- `site_settings`
  - `id` (int, primary key, always 1) — singleton row
  - `countdown_target` (timestamptz, not null) — the date the home countdown counts down to
  - `countdown_label` (text, default 'Next Event') — label above the countdown
  - `updated_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- All four CRUD verbs allowed for `anon, authenticated` because the data is
  intentionally public/shared (no sign-in screen). `USING (true)` is documented
  here as intentional public access, not as an ownership-check fallback.

## Important Notes
1. `scrims` is seeded with a few sample rows so the Scrims page isn't empty.
2. `site_settings` is seeded with a single singleton row (id = 1) with a
   countdown target ~30 days in the future from the time of this migration.
3. Both tables are safe to re-run (IF NOT EXISTS + DROP POLICY IF EXISTS).
*/

CREATE TABLE IF NOT EXISTS scrims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opponent text NOT NULL,
  date timestamptz NOT NULL,
  format text NOT NULL DEFAULT 'Best of 3',
  location text DEFAULT 'Online',
  result text DEFAULT 'TBD',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scrims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scrims" ON scrims;
CREATE POLICY "anon_select_scrims" ON scrims FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scrims" ON scrims;
CREATE POLICY "anon_insert_scrims" ON scrims FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_scrims" ON scrims;
CREATE POLICY "anon_update_scrims" ON scrims FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scrims" ON scrims;
CREATE POLICY "anon_delete_scrims" ON scrims FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  countdown_target timestamptz NOT NULL,
  countdown_label text NOT NULL DEFAULT 'Next Event',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
CREATE POLICY "anon_update_site_settings" ON site_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed the singleton site_settings row if it doesn't exist
INSERT INTO site_settings (id, countdown_target, countdown_label)
SELECT 1, now() + interval '30 days', 'Next Event'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

-- Seed a few sample scrims if the table is empty
INSERT INTO scrims (opponent, date, format, location, result, notes)
SELECT * FROM (VALUES
  ('Apex Squad',        now() + interval '3 days',  'Best of 3', 'Online',  'TBD', NULL),
  ('Night Owls',        now() + interval '7 days',  'Best of 5', 'Online',  'TBD', 'Map pool TBD'),
  ('Iron Wolves',       now() + interval '10 days', 'Best of 3', 'Online',  'TBD', NULL),
  ('Phantom Brigade',   now() + interval '14 days', 'Best of 5', 'Online',  'TBD', NULL),
  ('Vanguard Gaming',   now() - interval '2 days',  'Best of 3', 'Online',  'Win', 'Clean 2-0 sweep'),
  ('Eclipse Gaming',    now() - interval '6 days',  'Best of 5', 'Online',  'Loss', 'Tough series 1-3')
)
AS v(opponent, date, format, location, result, notes)
WHERE NOT EXISTS (SELECT 1 FROM scrims);

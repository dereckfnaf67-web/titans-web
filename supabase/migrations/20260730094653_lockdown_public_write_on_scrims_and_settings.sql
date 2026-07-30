/*
# Lock down public write access on scrims and site_settings

## Purpose
The Titans Website is a read-only public site — the frontend only ever SELECTs
from `scrims` and `site_settings`. The previous migration, however, granted the
public `anon` role full INSERT / UPDATE / DELETE access with `USING (true)` /
`WITH CHECK (true)`. Because the anon key is embedded in the public client, that
meant anyone on the internet could add, edit, or delete scrims and change the
countdown target — effectively bypassing row-level security.

This migration removes every public write policy so the tables are read-only to
the website. Content is still managed through the Supabase dashboard, whose
service-role connection bypasses RLS.

## Changes
1. `scrims`
   - DROP `anon_insert_scrims` (INSERT, was WITH CHECK (true) to anon, authenticated)
   - DROP `anon_update_scrims` (UPDATE, was USING/WITH CHECK (true) to anon, authenticated)
   - DROP `anon_delete_scrims` (DELETE, was USING (true) to anon, authenticated)
   - KEEP `anon_select_scrims` (SELECT) — intentional public read for the website.
2. `site_settings`
   - DROP `anon_update_site_settings` (UPDATE, was USING/WITH CHECK (true) to anon, authenticated)
   - KEEP `anon_select_site_settings` (SELECT) — intentional public read for the website.

## Security
- After this migration the anon-key client (the public website) can ONLY read
  these tables. All write operations are denied by RLS.
- There are no remaining `USING (true)` / `WITH CHECK (true)` write policies, so
  the "RLS policy always true" warnings are resolved.
- SELECT remains open to `anon, authenticated` because the data is intentionally
  public/shared (single-tenant, no sign-in) — this is documented and legitimate.
- Writes happen only via the Supabase dashboard / service role, which bypasses
  RLS by design.

## Important Notes
1. This is safe to re-run (DROP POLICY IF EXISTS is idempotent).
2. No data is touched — only policies are dropped.
3. The website continues to work unchanged because it only reads these tables.
*/

-- scrims: remove all public write policies
DROP POLICY IF EXISTS "anon_insert_scrims" ON scrims;
DROP POLICY IF EXISTS "anon_update_scrims" ON scrims;
DROP POLICY IF EXISTS "anon_delete_scrims" ON scrims;

-- site_settings: remove public write policy
DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;

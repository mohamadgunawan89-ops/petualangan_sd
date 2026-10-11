-- Penjaga: dipanggil GitHub Actions tiap beberapa hari supaya proyek Supabase gratis tidak dijeda
-- karena 7 hari tanpa aktivitas. Tidak membaca data apa pun.
create or replace function public.pts_ping() returns text
    language sql stable
    as $$ select 'ok'::text $$;
revoke all on function public.pts_ping() from public;
grant execute on function public.pts_ping() to anon, authenticated;

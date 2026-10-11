-- Perubahan : Petualangan TKA SD — kemajuan anak disinkronkan antarperangkat lewat kode sinkron (sementara)
--
-- Game Petualangan TKA SD (repository game_tka_sd) tidak punya akun. Kemajuan tersimpan di
-- peramban; supaya Dasbor Ortu di perangkat lain ikut melihatnya, kemajuan juga disimpan di sini.
--   1. Perangkat pertama meminta kode acak 8 huruf (pts_buat), mis. KIKO7QX3 (ditampilkan KIKO-7QX3).
--   2. Perangkat lain memakai kode itu untuk mengambil (pts_ambil) dan menyimpan (pts_simpan).
--   3. Orang tua bisa menghapus datanya dari server (pts_hapus).
-- Isi kemajuan disimpan utuh sebagai jsonb; penggabungan dua perangkat dilakukan di aplikasi.
-- Tabel berawalan pts_ dan tidak bersinggungan dengan tka_* (Tryout) maupun mtd_* (Matdas).
-- Tabel tidak bisa dibaca langsung (RLS tanpa policy); semua akses lewat fungsi di bawah.

create table if not exists public.pts_anak (
  kode   text primary key check (kode ~ '^[A-HJ-NP-Z2-9]{8}$'),
  data   jsonb not null,
  dibuat timestamptz not null default now(),
  diubah timestamptz not null default now()
);
alter table public.pts_anak enable row level security;
revoke all on table public.pts_anak from anon, authenticated;

-- Kode sinkron dari pengguna: buang tanda hubung/spasi, huruf besar
create or replace function public.pts_kode_bersih(p_kode text) returns text
    language sql immutable
    set search_path to 'public'
as $$ select upper(regexp_replace(coalesce(p_kode, ''), '[^A-Za-z0-9]', '', 'g')) $$;

create or replace function public.pts_data_sah(p_data jsonb) returns void
    language plpgsql immutable
    set search_path to 'public'
as $$
begin
  if p_data is null or jsonb_typeof(p_data) <> 'object' or p_data->>'v' is distinct from '1' then
    raise exception 'Data kemajuan tidak valid';
  end if;
  if octet_length(p_data::text) > 300000 then
    raise exception 'Data kemajuan terlalu besar';
  end if;
end $$;

-- Membuat kode baru beserta kemajuan awalnya. Kode dari gen_random_uuid() (acak kriptografis),
-- 8 huruf dari 32 simbol tanpa huruf/angka yang mirip (I, O, 0, 1) = 40 bit.
create or replace function public.pts_buat(p_data jsonb) returns jsonb
    language plpgsql security definer
    set search_path to 'public'
as $$
declare
  huruf constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  b bytea; k text; i int;
begin
  perform public.pts_data_sah(p_data);
  loop
    -- byte 6 dan 8 uuid v4 berisi penanda versi/varian, jadi tidak dipakai
    b := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    k := '';
    foreach i in array array[0, 1, 2, 3, 4, 5, 10, 11] loop
      k := k || substr(huruf, 1 + (get_byte(b, i) % 32), 1);
    end loop;
    exit when not exists (select 1 from public.pts_anak where kode = k);
  end loop;
  insert into public.pts_anak (kode, data) values (k, p_data);
  return jsonb_build_object('kode', k, 'diubah', now());
end $$;

create or replace function public.pts_ambil(p_kode text) returns jsonb
    language plpgsql security definer
    set search_path to 'public'
as $$
declare r public.pts_anak;
begin
  select * into r from public.pts_anak where kode = public.pts_kode_bersih(p_kode);
  if not found then raise exception 'Kode sinkron tidak ditemukan'; end if;
  return jsonb_build_object('kode', r.kode, 'data', r.data, 'diubah', r.diubah);
end $$;

create or replace function public.pts_simpan(p_kode text, p_data jsonb) returns jsonb
    language plpgsql security definer
    set search_path to 'public'
as $$
declare w timestamptz;
begin
  perform public.pts_data_sah(p_data);
  update public.pts_anak set data = p_data, diubah = now()
   where kode = public.pts_kode_bersih(p_kode)
  returning diubah into w;
  if not found then raise exception 'Kode sinkron tidak ditemukan'; end if;
  return jsonb_build_object('diubah', w);
end $$;

create or replace function public.pts_hapus(p_kode text) returns jsonb
    language plpgsql security definer
    set search_path to 'public'
as $$
begin
  delete from public.pts_anak where kode = public.pts_kode_bersih(p_kode);
  if not found then raise exception 'Kode sinkron tidak ditemukan'; end if;
  return jsonb_build_object('dihapus', true);
end $$;

revoke all on function public.pts_kode_bersih(text), public.pts_data_sah(jsonb) from public, anon, authenticated;
revoke all on function public.pts_buat(jsonb), public.pts_ambil(text), public.pts_simpan(text, jsonb), public.pts_hapus(text) from public;
grant execute on function public.pts_buat(jsonb), public.pts_ambil(text), public.pts_simpan(text, jsonb), public.pts_hapus(text)
  to anon, authenticated, service_role;

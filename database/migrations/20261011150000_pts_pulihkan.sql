-- Pemulihan Kode Anak (11 Okt 2026): tabel pts_anak sempat terhapus, sedangkan kemajuan masih ada di perangkat anak.
-- Perangkat yang membawa Kode Anak yang tidak ada di server mengirim ulang kemajuannya dengan kode yang sama.
-- Hanya membuat baris baru; kode yang sudah ada tidak pernah ditimpa.
create or replace function public.pts_pulihkan(p_kode text, p_data jsonb) returns jsonb
    language plpgsql security definer
    set search_path to 'public'
as $$
declare k text := public.pts_kode_bersih(p_kode);
begin
  perform public.pts_data_sah(p_data);
  if k !~ '^[A-HJ-NP-Z2-9]{8}$' then raise exception 'Kode sinkron tidak valid'; end if;
  insert into public.pts_anak (kode, data) values (k, p_data) on conflict (kode) do nothing;
  if not found then raise exception 'Kode sinkron sudah ada'; end if;
  return jsonb_build_object('kode', k, 'diubah', now());
end $$;
revoke all on function public.pts_pulihkan(text, jsonb) from public;
grant execute on function public.pts_pulihkan(text, jsonb) to anon, authenticated, service_role;

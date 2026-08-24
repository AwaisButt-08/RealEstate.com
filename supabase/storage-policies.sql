-- Run this in Supabase Dashboard -> SQL Editor.
-- The upload code stores files at: <auth.uid()>/<filename>

create policy "Users can upload their own profile images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'Mern-Estate'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can view their own profile images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'Mern-Estate'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Anyone can view listing images"
on storage.objects
for select
to public
using (bucket_id = 'Mern-Estate');

create policy "Users can replace their own profile images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'Mern-Estate'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'Mern-Estate'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

create policy "Users can delete their own profile images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'Mern-Estate'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
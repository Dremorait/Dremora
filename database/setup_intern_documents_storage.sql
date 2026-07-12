-- Dremora Intern Documents Storage Setup

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'intern_documents', 
  'intern_documents', 
  true, 
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Setup RLS Policies for the intern_documents bucket

-- Allow public read access (so the dashboard can display images)
CREATE POLICY "Public Access intern_docs" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'intern_documents' );

-- Allow authenticated admins to upload images
CREATE POLICY "Admin Upload Access intern_docs" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'intern_documents' );

-- Allow authenticated admins to update/replace images
CREATE POLICY "Admin Update Access intern_docs" 
ON storage.objects FOR UPDATE 
TO authenticated
USING ( bucket_id = 'intern_documents' );

-- Allow authenticated admins to delete images
CREATE POLICY "Admin Delete Access intern_docs" 
ON storage.objects FOR DELETE 
TO authenticated
USING ( bucket_id = 'intern_documents' );

-- Create a new storage bucket for store logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-logos', 'store-logos', true);

-- Set up storage policy to allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload logos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'store-logos');

-- Allow public access to read logos
CREATE POLICY "Allow public access to logos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'store-logos');
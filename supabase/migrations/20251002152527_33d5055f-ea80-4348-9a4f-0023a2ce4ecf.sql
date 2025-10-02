-- Create storage bucket for bill images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bills',
  'bills',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
);

-- RLS policies for bills bucket
CREATE POLICY "Users can upload their own bills"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'bills' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own bills"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'bills' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own bills"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'bills' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
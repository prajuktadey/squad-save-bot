-- Update bills bucket to be public so AI can access images
UPDATE storage.buckets 
SET public = true 
WHERE id = 'bills';
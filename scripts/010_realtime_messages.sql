-- Realtime ile mesaj dinleyebilmek için messages tablosunu yayına ekleyin
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

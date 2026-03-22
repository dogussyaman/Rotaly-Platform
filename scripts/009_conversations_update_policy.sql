-- Katılımcılar konuşmanın last_message_at alanını güncelleyebilir (mesaj gönderildiğinde)
CREATE POLICY "conversations_update_participant" ON public.conversations FOR UPDATE
  USING (participant_1 = auth.uid() OR participant_2 = auth.uid());

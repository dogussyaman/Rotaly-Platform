-- 1. Normalize: ensure participant_1 < participant_2 so (A,B) and (B,A) become the same canonical pair
UPDATE public.conversations
SET participant_1 = participant_2, participant_2 = participant_1
WHERE participant_1 > participant_2;

-- 2. Merge duplicate (participant_1, participant_2) rows: keep one per pair (latest last_message_at), move messages, then delete duplicates
WITH ordered AS (
  SELECT id, participant_1, participant_2, last_message_at,
         row_number() OVER (PARTITION BY participant_1, participant_2 ORDER BY last_message_at DESC NULLS LAST) AS rn
  FROM public.conversations
),
to_keep AS (
  SELECT id AS keep_id, participant_1, participant_2 FROM ordered WHERE rn = 1
),
to_remove AS (
  SELECT o.id AS remove_id, o.participant_1, o.participant_2
  FROM ordered o
  JOIN to_keep k ON o.participant_1 = k.participant_1 AND o.participant_2 = k.participant_2
  WHERE o.rn > 1
)
UPDATE public.messages m
SET conversation_id = k.keep_id
FROM to_remove r
JOIN to_keep k ON k.participant_1 = r.participant_1 AND k.participant_2 = r.participant_2
WHERE m.conversation_id = r.remove_id;

DELETE FROM public.conversations
WHERE id NOT IN (
  SELECT DISTINCT ON (participant_1, participant_2) id
  FROM public.conversations
  ORDER BY participant_1, participant_2, last_message_at DESC NULLS LAST
);

-- 3. Enforce one row per pair: unique constraint (app always inserts with participant_1 < participant_2)
ALTER TABLE public.conversations
ADD CONSTRAINT conversations_participants_unique UNIQUE (participant_1, participant_2);

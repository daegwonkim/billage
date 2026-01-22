ALTER TABLE chat_participants
ADD COLUMN last_read_message_id BIGINT NULL;

UPDATE chat_participants cp
SET last_read_message_id = sub.max_message_id
FROM (
    SELECT chat_room_id, MAX(id) AS max_message_id
    FROM chat_messages
    GROUP BY chat_room_id
) sub
WHERE cp.chat_room_id = sub.chat_room_id
    AND cp.last_read_message_id IS NULL;
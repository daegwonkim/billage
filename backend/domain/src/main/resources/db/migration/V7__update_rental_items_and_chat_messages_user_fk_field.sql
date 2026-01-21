ALTER TABLE rental_items
RENAME COLUMN user_id TO seller_id;

ALTER TABLE chat_messages
RENAME COLUMN user_id TO sender_id;
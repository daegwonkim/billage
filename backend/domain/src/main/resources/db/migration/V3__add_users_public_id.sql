ALTER TABLE users
ADD COLUMN public_id VARCHAR(8);

UPDATE users
SET public_id = UPPER(SUBSTRING(MD5(random()::text) FROM 1 FOR 8))
WHERE public_id IS NULL;

CREATE UNIQUE INDEX users_nickname_public_id_uk
ON users (nickname, public_id);

ALTER TABLE users
ALTER COLUMN public_id SET NOT NULL;
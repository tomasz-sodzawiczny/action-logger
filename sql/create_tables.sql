CREATE TABLE IF NOT EXISTS kinds (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64)
);
CREATE TABLE IF NOT EXISTS actions (
    id BIGSERIAL PRIMARY KEY,
    kind_id BIGSERIAL NOT NULL REFERENCES kinds (id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS hooks (
    id BIGSERIAL PRIMARY KEY,
    kind_id BIGSERIAL NOT NULL REFERENCES kinds (id),
    name VARCHAR(64) NOT NULL DEFAULT '',
    token VARCHAR(64) NOT NULL
);
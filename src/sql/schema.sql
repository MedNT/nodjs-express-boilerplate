---LeadMate Tables SQL Script


-- CLIENTS TABLE
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL CHECK (type IN ('store_owner', 'agency_owner')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE clients
ADD COLUMN password VARCHAR(255) NOT NULL,
ADD COLUMN reset_password_token VARCHAR(255),
ADD COLUMN reset_password_expires TIMESTAMP;

-- STORES TABLE
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WHATSAPP ACCOUNTS TABLE
CREATE TABLE whatsapp_accounts (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  phone_number_id VARCHAR(100) NOT NULL,
  access_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  business_id VARCHAR(100),
  connected_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- CHAT SESSIONS TABLE
CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  user_phone VARCHAR(20) NOT NULL,
  session_start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP,
  agent_mode VARCHAR(50) DEFAULT 'default'
);

-- CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  chat_session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role VARCHAR(10) CHECK (role IN ('user', 'agent')) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_memory BOOLEAN DEFAULT TRUE
);

-- DATA SOURCES TABLE
CREATE TABLE data_sources (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  source_type VARCHAR(50) NOT NULL, -- e.g., 'pdf', 'csv', 'url', 'notion', etc.
  source_url TEXT,
  last_indexed_at TIMESTAMP
);


--- Vectore Databse Table To store embeddings

-- Enable pgvector if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Updated vector_index table (multi-tenant aware)
CREATE TABLE vector_index (
  id BIGSERIAL PRIMARY KEY,
  store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  namespace VARCHAR(100) NOT NULL, -- Logical grouping per store (e.g. 'faqs', 'products')
  content TEXT NOT NULL, -- Actual document content
  metadata JSONB,        -- Optional metadata, e.g. source_url, language, tags, etc.
  embedding VECTOR(1536) -- Adjust dimension to match your embedding model
);

-- Add an index on embeddings for similarity search
CREATE INDEX ON vector_index USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Optional index to speed up store-based filtering
CREATE INDEX idx_vector_index_store_id_namespace ON vector_index(store_id, namespace);

-- Updated function for document search (tenant-aware)
CREATE OR REPLACE FUNCTION match_vector_index (
  query_embedding VECTOR(1536),
  match_count INT DEFAULT 5,
  store_filter INT,
  namespace_filter VARCHAR DEFAULT NULL,
  metadata_filter JSONB DEFAULT '{}'
) RETURNS TABLE (
  id BIGINT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    id,
    content,
    metadata,
    1 - (embedding <=> query_embedding) AS similarity
  FROM vector_index
  WHERE store_id = store_filter
    AND (namespace_filter IS NULL OR namespace = namespace_filter)
    AND metadata @> metadata_filter
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
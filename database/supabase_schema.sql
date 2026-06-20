-- Supabase PostgreSQL Schema for Dremora
-- Copy and paste this into the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Matched from db_setup.py / forms.js
    full_name VARCHAR(100),     -- Legacy from dremora_schema.sql
    email VARCHAR(100) NOT NULL,
    college VARCHAR(255),       -- Matched from db_setup.py
    college_name VARCHAR(200),  -- Legacy from dremora_schema.sql
    domain VARCHAR(255),        -- Matched from db_setup.py
    selected_domain VARCHAR(100),-- Legacy from dremora_schema.sql
    why_join TEXT,              -- Matched from db_setup.py
    message TEXT,               -- Legacy from dremora_schema.sql
    application_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category VARCHAR(100),
    tech_stack VARCHAR(255),
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    user_query TEXT,            -- Matched from db_setup.py
    user_message TEXT,          -- Legacy from dremora_schema.sql
    ai_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) on tables for secure direct frontend access in the future
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- If you want the backend to access them freely while using the Service Role Key or direct Postgres connection,
-- no additional RLS policies are strictly required, as Postgres superuser/postgres role bypasses RLS.

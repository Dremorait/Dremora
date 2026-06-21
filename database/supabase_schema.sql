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
    name VARCHAR(100) NOT NULL CHECK (char_length(name) > 0),
    email VARCHAR(100) NOT NULL CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL CHECK (char_length(message) <= 2000),
    inquiry_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL CHECK (char_length(name) > 0), -- Matched from db_setup.py / forms.js
    full_name VARCHAR(100),     -- Legacy from dremora_schema.sql
    email VARCHAR(100) NOT NULL CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    college VARCHAR(255),       -- Matched from db_setup.py
    college_name VARCHAR(200),  -- Legacy from dremora_schema.sql
    domain VARCHAR(255),        -- Matched from db_setup.py
    selected_domain VARCHAR(100),-- Legacy from dremora_schema.sql
    why_join TEXT CHECK (char_length(why_join) <= 3000), -- Matched from db_setup.py
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

-- ============================================================
-- RLS POLICIES: Allow anonymous users to INSERT from the browser
-- Run these in Supabase SQL Editor to enable direct form submissions
-- ============================================================

-- Allow anyone (anon) to submit a contact inquiry
DROP POLICY IF EXISTS "allow_anon_insert_contacts" ON contacts;
CREATE POLICY "allow_anon_insert_contacts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone (anon) to submit an internship application
DROP POLICY IF EXISTS "allow_anon_insert_internships" ON internships;
CREATE POLICY "allow_anon_insert_internships"
  ON internships FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone (anon) to log AI chat messages
DROP POLICY IF EXISTS "allow_anon_insert_ai_chat_logs" ON ai_chat_logs;
CREATE POLICY "allow_anon_insert_ai_chat_logs"
  ON ai_chat_logs FOR INSERT
  TO anon
  WITH CHECK (true);

-- NOTE: No SELECT policy for anon = data stays private (admin-only reads via service role)

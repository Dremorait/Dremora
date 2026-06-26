-- Dremora Internship Portal v2.0 Database Schema
-- Supabase PostgreSQL Configuration

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING TABLES (For Clean Refactor)
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.interns CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;

-- 3. CREATE TABLES

-- Admins Table
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Interns Table
CREATE TABLE public.interns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    college TEXT,
    course TEXT,
    domain TEXT,
    batch TEXT,
    mentor TEXT,
    start_date DATE,
    end_date DATE,
    progress_percent INTEGER DEFAULT 0,
    attendance_percent INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    certificate_status TEXT DEFAULT 'Pending',
    certificate_number TEXT,
    certificate_url TEXT,
    photo TEXT,
    status TEXT DEFAULT 'Active', -- 'Active', 'Completed', 'Inactive'
    remarks TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Announcements Table
CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience TEXT DEFAULT 'All', -- 'All', 'Active', 'Completed'
    created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certificates Table (Separate table for multiple/special certs if needed, or normalized storage)
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intern_id UUID REFERENCES public.interns(id) ON DELETE CASCADE,
    cert_number TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activity Logs Table (Audit Trail)
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., "Updated Intern", "Added Certificate"
    target_id TEXT, -- The ID of the affected record
    target_table TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. INDEXES for Performance
CREATE INDEX idx_interns_intern_id ON public.interns(intern_id);
CREATE INDEX idx_interns_full_name ON public.interns(full_name);
CREATE INDEX idx_interns_status ON public.interns(status);
CREATE INDEX idx_certificates_intern_id ON public.certificates(intern_id);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 5. ROW LEVEL SECURITY (RLS)

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Admins: No public access
CREATE POLICY "Deny anon admins" ON public.admins FOR ALL TO anon USING (false);

-- Interns: Anon can SELECT only via backend (Or if we allow public access via anon key for search)
-- Since the user said "Never expose database errors... Search Supabase for a matching record",
-- The backend uses service_role key to bypass RLS, so anon can be fully restricted!
CREATE POLICY "Deny anon interns" ON public.interns FOR ALL TO anon USING (false);

-- Announcements: Anon can read
CREATE POLICY "Allow anon select announcements" ON public.announcements FOR SELECT TO anon USING (true);

-- Certificates: Anon can read
CREATE POLICY "Allow anon select certificates" ON public.certificates FOR SELECT TO anon USING (true);

-- Activity Logs: No public access
CREATE POLICY "Deny anon logs" ON public.activity_logs FOR ALL TO anon USING (false);

-- 6. SEED DATA
-- Default Admin (Password: admin)
INSERT INTO public.admins (admin_id, full_name, email, password_hash)
VALUES ('ADMIN-001', 'System Admin', 'admin@dremora.com', '$2a$10$f/2296T8/M3g3Uv2K0eY0On.sI.lD2uS.1a92aM3hKkXnL2l8Y4R6')
ON CONFLICT (email) DO NOTHING;

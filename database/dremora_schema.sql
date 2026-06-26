CREATE DATABASE IF NOT EXISTS dremora_db;
USE dremora_db;

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    inquiry_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    college_name VARCHAR(200),
    selected_domain VARCHAR(100),
    message TEXT,
    application_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    short_description TEXT,
    full_description TEXT,
    category VARCHAR(100),
    tech_stack VARCHAR(255),
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ai_chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100),
    user_message TEXT,
    ai_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    intern_id VARCHAR(50) UNIQUE NOT NULL,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    batch VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    certificate_url TEXT,
    photo TEXT,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO interns (intern_id, certificate_number, full_name, domain, batch, status) VALUES
('DRM-INT-2026-001', 'DRM-CERT-2026-WD-001', 'Krushna Bhadale', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-002', 'DRM-CERT-2026-WD-002', 'Amar Londhe', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-003', 'DRM-CERT-2026-WD-003', 'Samiksha Gore', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-004', 'DRM-CERT-2026-WD-004', 'Vrishin Bhandari', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-005', 'DRM-CERT-2026-WD-005', 'Yash Mahajen', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-006', 'DRM-CERT-2026-WD-006', 'Zeeshan Patel', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-007', 'DRM-CERT-2026-WD-007', 'Vaibhav More', 'Web Development', '2026', 'Active'),
('DRM-INT-2026-008', 'DRM-CERT-2026-WD-008', 'Samarth Kale', 'Web Development', '2026', 'Active');

-- ============================================================================
-- PM INTERNSHIP SCHEME - AI RECOMMENDATION SYSTEM DATABASE
-- Complete Database Schema & Seed Data Script
-- Compatible with PostgreSQL (with pgvector extension)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For AI vector similarity search (Sentence Transformers / OpenAI / Gemini embeddings)

-- Drop existing tables (in reverse dependency order) if needed for fresh setup
DROP TABLE IF EXISTS ai_recommendations CASCADE;
DROP TABLE IF EXISTS candidate_interactions CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS internship_skills CASCADE;
DROP TABLE IF EXISTS internships CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS candidate_preferences CASCADE;
DROP TABLE IF EXISTS candidate_skills CASCADE;
DROP TABLE IF EXISTS candidate_education CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS skills_master CASCADE;
DROP TABLE IF EXISTS sectors_master CASCADE;
DROP TABLE IF EXISTS districts_master CASCADE;

-- ============================================================================
-- 1. MASTER TABLES
-- ============================================================================

-- Geo/Location Master (Tracks State, District, Tier & Aspirational District Status)
CREATE TABLE districts_master (
    district_id SERIAL PRIMARY KEY,
    state_name VARCHAR(100) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    is_aspirational BOOLEAN DEFAULT FALSE,
    tier VARCHAR(20) DEFAULT 'Tier-3', -- Tier-1, Tier-2, Tier-3, Rural, Aspirational
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Industry/Sector Master (e.g., Automotive, BFSI, IT, Manufacturing, Healthcare)
CREATE TABLE sectors_master (
    sector_id SERIAL PRIMARY KEY,
    sector_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Standard Skills Taxonomy
CREATE TABLE skills_master (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL, -- Technical, Soft Skills, Vocational, Tool, Language
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 2. CANDIDATE PROFILE TABLES
-- ============================================================================

CREATE TABLE candidates (
    candidate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20), -- Male, Female, Other
    category VARCHAR(20), -- General, OBC, SC, ST, EWS
    is_pwd BOOLEAN DEFAULT FALSE, -- Persons with Benchmark Disabilities
    
    -- Address
    district_id INT REFERENCES districts_master(district_id),
    pincode VARCHAR(10) NOT NULL,
    
    -- Bio & AI Vector Embedding (for semantic matching from resume/profile summary)
    bio_summary TEXT,
    profile_embedding vector(384), -- 384 dimensions for all-MiniLM-L6-v2 or 768 for Gemini/Sentence-BERT
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- PM Scheme Eligibility: Age between 21 and 24
    CONSTRAINT check_candidate_age CHECK (
        date_of_birth <= (CURRENT_DATE - INTERVAL '21 years') AND
        date_of_birth >= (CURRENT_DATE - INTERVAL '24 years')
    )
);

-- Candidate Education History (10th/12th/ITI/Diploma/Graduate/PG)
CREATE TABLE candidate_education (
    education_id SERIAL PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    qualification_level VARCHAR(50) NOT NULL, -- 10th, 12th, ITI, Diploma, Graduate, PostGraduate
    degree_name VARCHAR(150),                 -- e.g., ITI Electrician, B.Com, BCA, Diploma Mechanical
    field_of_study VARCHAR(100),
    institution_name VARCHAR(200),
    passing_year INT NOT NULL,
    percentage_or_cgpa NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Skills Mapping
CREATE TABLE candidate_skills (
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills_master(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) DEFAULT 'Intermediate', -- Beginner, Intermediate, Expert
    is_certified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (candidate_id, skill_id)
);

-- Candidate Preferences for AI Recommendation Tuning
CREATE TABLE candidate_preferences (
    preference_id SERIAL PRIMARY KEY,
    candidate_id UUID UNIQUE REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    preferred_sector_id INT REFERENCES sectors_master(sector_id),
    preferred_district_id INT REFERENCES districts_master(district_id),
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    preferred_work_mode VARCHAR(20) DEFAULT 'On-Site' -- On-Site, Hybrid, Remote
);

-- ============================================================================
-- 3. COMPANIES & INTERNSHIP POSTINGS
-- ============================================================================

CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    cin_or_reg_number VARCHAR(50) UNIQUE,
    sector_id INT REFERENCES sectors_master(sector_id),
    is_top_500_csr BOOLEAN DEFAULT TRUE,
    website VARCHAR(255),
    headquarters_district_id INT REFERENCES districts_master(district_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE internships (
    internship_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    sector_id INT REFERENCES sectors_master(sector_id),
    
    -- Location & Capacity
    district_id INT REFERENCES districts_master(district_id),
    vacancies_count INT DEFAULT 1,
    duration_months INT DEFAULT 12, -- Standardized 12 months for PM Scheme
    
    -- Stipend Structure (PM Scheme ₹5000/mo = ₹4500 Govt + ₹500 CSR)
    monthly_stipend NUMERIC(10, 2) DEFAULT 5000.00,
    one_time_grant NUMERIC(10, 2) DEFAULT 6000.00,
    
    -- Eligibility Rules
    min_qualification VARCHAR(50) NOT NULL, -- ITI, Diploma, Graduate, etc.
    eligible_degrees TEXT[],                 -- Array of allowed degrees e.g. ARRAY['B.Com', 'BBA', 'B.Sc']
    
    -- AI Semantic Embedding of Job Description & Skill Requirements
    internship_embedding vector(384),
    
    status VARCHAR(20) DEFAULT 'Active', -- Active, Closed, Draft
    application_deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Mandatory & Optional Skills for Internships
CREATE TABLE internship_skills (
    internship_id UUID REFERENCES internships(internship_id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills_master(skill_id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (internship_id, skill_id)
);

-- ============================================================================
-- 4. APPLICATIONS & USER INTERACTION LOGS
-- ============================================================================

CREATE TABLE applications (
    application_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(internship_id) ON DELETE CASCADE,
    application_status VARCHAR(30) DEFAULT 'Submitted', -- Submitted, Under_Review, Shortlisted, Selected, Rejected, Joined
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    CONSTRAINT unique_candidate_internship UNIQUE (candidate_id, internship_id)
);

-- User Behavioral Tracking (Feeds into Collaborative Filtering / Re-ranking AI)
CREATE TABLE candidate_interactions (
    interaction_id BIGSERIAL PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(internship_id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL, -- View, Click, Bookmark, Share, Apply
    dwell_time_seconds INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 5. AI RECOMMENDATIONS OUTPUT TABLE
-- ============================================================================

CREATE TABLE ai_recommendations (
    recommendation_id BIGSERIAL PRIMARY KEY,
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    internship_id UUID REFERENCES internships(internship_id) ON DELETE CASCADE,
    
    -- Composite AI Scoring Breakdown
    total_match_score NUMERIC(5, 2) NOT NULL,      -- 0.00 to 100.00
    skill_match_score NUMERIC(5, 2) DEFAULT 0,      -- 0.00 to 100.00
    location_match_score NUMERIC(5, 2) DEFAULT 0,   -- 0.00 to 100.00
    education_match_score NUMERIC(5, 2) DEFAULT 0,  -- 0.00 to 100.00
    vector_similarity_score NUMERIC(5, 4) DEFAULT 0,-- -1.0000 to 1.0000
    
    explanation TEXT, -- Explainable AI reason (e.g., "100% skill match, within home district")
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_recommendation UNIQUE (candidate_id, internship_id)
);

-- ============================================================================
-- 6. INDEXES FOR HIGH-SPEED QUERYING & VECTOR SEARCH
-- ============================================================================

CREATE INDEX idx_candidates_district ON candidates(district_id);
CREATE INDEX idx_internships_district ON internships(district_id);
CREATE INDEX idx_internships_sector ON internships(sector_id);
CREATE INDEX idx_recommendations_candidate ON ai_recommendations(candidate_id, total_match_score DESC);
CREATE INDEX idx_interactions_candidate ON candidate_interactions(candidate_id, internship_id);

-- HNSW Vector Indexes for Fast Cosine Distance Search
CREATE INDEX idx_internship_embeddings ON internships USING hnsw (internship_embedding vector_cosine_ops);
CREATE INDEX idx_candidate_embeddings ON candidates USING hnsw (profile_embedding vector_cosine_ops);

-- ============================================================================
-- 7. SEED DATA FOR DEMO & TESTING
-- ============================================================================

-- 1. Insert Sectors
INSERT INTO sectors_master (sector_name, description) VALUES
('Automotive & Mobility', 'Vehicle design, assembly line, EV batteries, quality inspection'),
('BFSI (Banking & Financial Services)', 'Retail banking, micro-finance, risk analysis, accounting'),
('Information Technology', 'Software support, data entry, basic web development, QA'),
('Manufacturing & Heavy Engineering', 'Industrial plant operations, CNC machining, electrical maintenance'),
('Healthcare & Pharmaceuticals', 'Medical lab assistance, hospital logistics, pharma inventory');

-- 2. Insert Districts
INSERT INTO districts_master (state_name, district_name, is_aspirational, tier) VALUES
('Maharashtra', 'Pune', FALSE, 'Tier-1'),
('Maharashtra', 'Gadchiroli', TRUE, 'Tier-3'),
('Madhya Pradesh', 'Indore', FALSE, 'Tier-2'),
('Madhya Pradesh', 'Singrauli', TRUE, 'Aspirational'),
('Uttar Pradesh', 'Lucknow', FALSE, 'Tier-2'),
('Uttar Pradesh', 'Chitrakoot', TRUE, 'Aspirational'),
('Karnataka', 'Bengaluru Urban', FALSE, 'Tier-1'),
('Tamil Nadu', 'Ramanathapuram', TRUE, 'Aspirational');

-- 3. Insert Skills
INSERT INTO skills_master (skill_name, category) VALUES
('AutoCAD', 'Technical'),
('CNC Machine Operation', 'Vocational'),
('Tally ERP & GST', 'Technical'),
('Python Basics', 'Technical'),
('Customer Support & Communication', 'Soft Skills'),
('Electrical Wiring & Safety', 'Vocational'),
('Excel & Data Entry', 'Tool'),
('Quality Inspection', 'Vocational');

-- 4. Insert Top 500 CSR Companies
INSERT INTO companies (company_name, cin_or_reg_number, sector_id, is_top_500_csr) VALUES
('Tata Motors Ltd', 'L28920MH1945PLC004520', 1, TRUE),
('HDFC Bank Ltd', 'L65920MH1994PLC080618', 2, TRUE),
('Larsen & Toubro (L&T)', 'L99999MH1946PLC004768', 4, TRUE),
('Infosys BPM', 'L85110KA1981PLC013115', 3, TRUE);

-- 5. Insert Sample Internships
INSERT INTO internships (company_id, title, description, sector_id, district_id, vacancies_count, min_qualification, eligible_degrees) VALUES
((SELECT company_id FROM companies WHERE company_name='Tata Motors Ltd'), 
 'Junior Assembly Line Trainee', 
 'Hands-on training in mechanical assembly, EV wiring harness testing, and basic QC.', 
 1, 1, 15, 'Diploma', ARRAY['Diploma Mechanical', 'Diploma Electrical', 'ITI Motor Mechanic']),

((SELECT company_id FROM companies WHERE company_name='HDFC Bank Ltd'), 
 'Branch Operations & Audit Assistant', 
 'Assisting in KYC verification, document auditing, retail loan file processing and Tally entries.', 
 2, 5, 20, 'Graduate', ARRAY['B.Com', 'BBA', 'B.A. Economics']),

((SELECT company_id FROM companies WHERE company_name='Larsen & Toubro (L&T)'), 
 'Electrical Maintenance Apprentice', 
 'Industrial power supply maintenance, switchgear inspection, and preventive upkeep.', 
 4, 4, 10, 'ITI', ARRAY['ITI Electrician', 'Diploma Electrical']);

-- Map Required Skills to Internships
INSERT INTO internship_skills (internship_id, skill_id, is_mandatory) VALUES
((SELECT internship_id FROM internships WHERE title='Junior Assembly Line Trainee'), (SELECT skill_id FROM skills_master WHERE skill_name='Quality Inspection'), TRUE),
((SELECT internship_id FROM internships WHERE title='Junior Assembly Line Trainee'), (SELECT skill_id FROM skills_master WHERE skill_name='AutoCAD'), FALSE),
((SELECT internship_id FROM internships WHERE title='Branch Operations & Audit Assistant'), (SELECT skill_id FROM skills_master WHERE skill_name='Tally ERP & GST'), TRUE),
((SELECT internship_id FROM internships WHERE title='Branch Operations & Audit Assistant'), (SELECT skill_id FROM skills_master WHERE skill_name='Excel & Data Entry'), TRUE),
((SELECT internship_id FROM internships WHERE title='Electrical Maintenance Apprentice'), (SELECT skill_id FROM skills_master WHERE skill_name='Electrical Wiring & Safety'), TRUE);

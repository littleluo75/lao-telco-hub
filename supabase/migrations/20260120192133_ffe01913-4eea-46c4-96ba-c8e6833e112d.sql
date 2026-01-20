-- 1. Master Data Tables
CREATE TABLE public.enterprise_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.service_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    group_type VARCHAR(50),
    requires_license BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE public.license_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    has_expiry BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

CREATE TABLE public.resource_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    format_rule VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE'
);

-- 2. Core Entities
CREATE TABLE public.enterprises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(50),
    representative VARCHAR(100),
    enterprise_type_id UUID REFERENCES public.enterprise_types(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_number VARCHAR(100) UNIQUE,
    enterprise_id UUID REFERENCES public.enterprises(id),
    license_type_id UUID REFERENCES public.license_types(id),
    issue_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'DRAFT',
    file_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    enterprise_id UUID REFERENCES public.enterprises(id),
    license_id UUID REFERENCES public.licenses(id),
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    workflow_step_id UUID,
    submission_date TIMESTAMP WITH TIME ZONE,
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.number_ranges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prefix VARCHAR(20),
    start_number BIGINT,
    end_number BIGINT,
    block_size INT,
    telco_id UUID REFERENCES public.enterprises(id),
    license_id UUID REFERENCES public.licenses(id),
    status VARCHAR(50) DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    msisdn VARCHAR(20) UNIQUE,
    serial_number VARCHAR(50),
    telco_id UUID REFERENCES public.enterprises(id),
    range_id UUID REFERENCES public.number_ranges(id),
    sub_type VARCHAR(50),
    activation_status VARCHAR(50) DEFAULT 'NOT_ACTIVATED',
    activation_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    last_sync_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.compliance_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    detection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    license_id UUID REFERENCES public.licenses(id),
    enterprise_id UUID REFERENCES public.enterprises(id),
    violation_type VARCHAR(255),
    description TEXT,
    severity VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(50) DEFAULT 'NEW'
);

CREATE TABLE public.system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100),
    actor VARCHAR(100),
    target_entity VARCHAR(100),
    target_id UUID,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables (public read for this internal government tool)
ALTER TABLE public.enterprise_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.number_ranges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (internal government tool)
CREATE POLICY "Allow public read enterprise_types" ON public.enterprise_types FOR SELECT USING (true);
CREATE POLICY "Allow public read service_types" ON public.service_types FOR SELECT USING (true);
CREATE POLICY "Allow public read license_types" ON public.license_types FOR SELECT USING (true);
CREATE POLICY "Allow public read resource_types" ON public.resource_types FOR SELECT USING (true);
CREATE POLICY "Allow public read enterprises" ON public.enterprises FOR SELECT USING (true);
CREATE POLICY "Allow public read licenses" ON public.licenses FOR SELECT USING (true);
CREATE POLICY "Allow public read applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow public read number_ranges" ON public.number_ranges FOR SELECT USING (true);
CREATE POLICY "Allow public read subscribers" ON public.subscribers FOR SELECT USING (true);
CREATE POLICY "Allow public read compliance_violations" ON public.compliance_violations FOR SELECT USING (true);
CREATE POLICY "Allow public read system_logs" ON public.system_logs FOR SELECT USING (true);

-- RLS Policies for public insert/update/delete (internal tool - will add auth later)
CREATE POLICY "Allow public insert enterprise_types" ON public.enterprise_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update enterprise_types" ON public.enterprise_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete enterprise_types" ON public.enterprise_types FOR DELETE USING (true);

CREATE POLICY "Allow public insert service_types" ON public.service_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update service_types" ON public.service_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete service_types" ON public.service_types FOR DELETE USING (true);

CREATE POLICY "Allow public insert license_types" ON public.license_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update license_types" ON public.license_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete license_types" ON public.license_types FOR DELETE USING (true);

CREATE POLICY "Allow public insert resource_types" ON public.resource_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update resource_types" ON public.resource_types FOR UPDATE USING (true);
CREATE POLICY "Allow public delete resource_types" ON public.resource_types FOR DELETE USING (true);

CREATE POLICY "Allow public insert enterprises" ON public.enterprises FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update enterprises" ON public.enterprises FOR UPDATE USING (true);
CREATE POLICY "Allow public delete enterprises" ON public.enterprises FOR DELETE USING (true);

CREATE POLICY "Allow public insert licenses" ON public.licenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update licenses" ON public.licenses FOR UPDATE USING (true);
CREATE POLICY "Allow public delete licenses" ON public.licenses FOR DELETE USING (true);

CREATE POLICY "Allow public insert applications" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update applications" ON public.applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete applications" ON public.applications FOR DELETE USING (true);

CREATE POLICY "Allow public insert number_ranges" ON public.number_ranges FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update number_ranges" ON public.number_ranges FOR UPDATE USING (true);
CREATE POLICY "Allow public delete number_ranges" ON public.number_ranges FOR DELETE USING (true);

CREATE POLICY "Allow public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update subscribers" ON public.subscribers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete subscribers" ON public.subscribers FOR DELETE USING (true);

CREATE POLICY "Allow public insert compliance_violations" ON public.compliance_violations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update compliance_violations" ON public.compliance_violations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete compliance_violations" ON public.compliance_violations FOR DELETE USING (true);

CREATE POLICY "Allow public insert system_logs" ON public.system_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update system_logs" ON public.system_logs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete system_logs" ON public.system_logs FOR DELETE USING (true);
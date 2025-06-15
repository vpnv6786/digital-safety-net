
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  phone_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  report_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create entities table (objects being reported - phone numbers, URLs, etc.)
CREATE TABLE public.entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_value TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('phone', 'url', 'bank_account', 'other')),
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  report_count INTEGER DEFAULT 0,
  last_reported_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(entity_value, entity_type)
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_user_id UUID REFERENCES auth.users NOT NULL,
  entity_id UUID REFERENCES public.entities NOT NULL,
  scam_category TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by_moderator_id UUID REFERENCES auth.users,
  confirmations UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_entities_value_type ON public.entities(entity_value, entity_type);
CREATE INDEX idx_entities_risk_score ON public.entities(risk_score DESC);
CREATE INDEX idx_reports_entity_id ON public.reports(entity_id);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Entities policies (public read access for checking)
CREATE POLICY "Anyone can view entities" 
  ON public.entities FOR SELECT 
  TO public USING (true);

CREATE POLICY "Authenticated users can create entities" 
  ON public.entities FOR INSERT 
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update entities" 
  ON public.entities FOR UPDATE 
  TO authenticated USING (true);

-- Reports policies
CREATE POLICY "Users can view reports" 
  ON public.reports FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can create reports" 
  ON public.reports FOR INSERT 
  TO authenticated WITH CHECK (auth.uid() = reporter_user_id);

CREATE POLICY "Users can update their own reports" 
  ON public.reports FOR UPDATE 
  TO authenticated USING (auth.uid() = reporter_user_id);

-- Function to create profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, phone_number)
  VALUES (new.id, new.phone);
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update entity risk score based on reports
CREATE OR REPLACE FUNCTION public.update_entity_risk_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the entity's report count and risk score
  UPDATE public.entities 
  SET 
    report_count = (
      SELECT COUNT(*) 
      FROM public.reports 
      WHERE entity_id = NEW.entity_id AND status IN ('pending', 'verified')
    ),
    risk_score = LEAST(100, (
      SELECT COUNT(*) * 20 
      FROM public.reports 
      WHERE entity_id = NEW.entity_id AND status IN ('pending', 'verified')
    )),
    last_reported_at = NOW()
  WHERE id = NEW.entity_id;
  
  -- Update user's report count
  UPDATE public.profiles 
  SET report_count = report_count + 1
  WHERE id = NEW.reporter_user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update risk scores when reports are added
CREATE TRIGGER on_report_created
  AFTER INSERT ON public.reports
  FOR EACH ROW EXECUTE PROCEDURE public.update_entity_risk_score();

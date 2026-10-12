CREATE TABLE IF NOT EXISTS public.tasks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  brand_id      UUID,
  brand_name    TEXT NOT NULL,
  platform      TEXT NOT NULL DEFAULT 'shopee',
  pillar        TEXT NOT NULL DEFAULT 'listing',
  status        TEXT NOT NULL DEFAULT 'backlog',
  priority      TEXT NOT NULL DEFAULT 'normal',
  assigned_to   UUID,
  assigned_name TEXT,
  deadline      DATE,
  has_issue     BOOLEAN DEFAULT false,
  issue_notes   TEXT,
  external_link TEXT,
  created_by    UUID,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tasks_policy" ON public.tasks;
CREATE POLICY "tasks_policy" ON public.tasks FOR ALL USING (true);

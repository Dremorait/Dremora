export interface Intern {
  id: number;
  intern_id: string;
  certificate_number: string;
  full_name: string;
  domain: string;
  batch: string;
  status: 'Active' | 'Completed' | 'Revoked';
  start_date: string | null;
  end_date: string | null;
  certificate_url: string | null;
  photo: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

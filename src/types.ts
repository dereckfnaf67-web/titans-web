export interface Scrim {
  id: string;
  opponent: string;
  date: string;
  format: string;
  location: string | null;
  result: string | null;
  notes: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  countdown_target: string;
  countdown_label: string;
  updated_at: string;
}

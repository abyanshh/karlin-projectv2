export type Project = {
  id: string;
  po: string;
  client: string;
  pic?: string;
  status: string;
  progress?: number;
  deadline?: string;
  NameSales?: string;
}

export type Task = {
  id: string;
  project_id: string;
  nama: string;
  description?: string;
  file_url?: string;
  status: string;
}

export interface ProfileMember {
  id: string;
  user_nama: string;
  image_url: string;
  email: string;
  no_hp?: string;
  ttl?:string;
  role: string;
  jabatan?: string;
}

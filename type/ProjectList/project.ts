export interface Project {
  PIC: {
    user_nama: string;
  };
  Sales: {
    user_nama: string;
  };
  id: string;
  po: string;
  client: string;
  ID_pic?: string;
  status: string;
  nama_sales?: string;
  progress?: number;
  deadline?: string;
  team: ProfileMember[];
}

export interface Task {
  id: string;
  nama: string;
  deskripsi?: string;
  file_url?: string;
  status: string;
}

export interface ProfileMember {
  id: string;
  user_nama: string;
  image_url?: string;
  email?: string;
  no_hp?: string;
  ttl?: string;
  role?: string;
  jabatan?: string;
}

export type OverviewStats = {
  active_projects: number;
  taken_projects: number;
  close_to_deadline: number;
  past_deadline: number;
};

type Role = "admin" | "sales" | "pm" | "staff";

export interface User {
  id: string;
  role: Role;
}
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
  pic?: string;
  status: string;
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
  user_nama?: string;
  image_url?: string;
  email?: string;
  no_hp?: string;
  ttl?: string;
  role?: string;
  jabatan?: string;
}

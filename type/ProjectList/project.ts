export type Project = {
  id: string;
  po?: number;
  name?: string;
  client?: string;
  pic?: string;
  status: string;
  progress?: number;
  deadline?: string;
  team?: number;
  description?: string;
  NameSales?: string;
}

export type Task = {
  id: string;
  name: string;
  description?: string;
  file_url?: string;
  status: string;
}

export type Member = {
  id: string;
  image: string;
  name: string;
  email?: string;
  role: string;
  lastOnline?: string;
}

export interface ProfileMember {
  id: string;
  name: string;
  image: string;
  email?: string;
  phone?: string;
  birthdate?:string;
  position?: string;
  department?: string;
  location?: string;
  bio?: string;
  joinDate?:string;
}

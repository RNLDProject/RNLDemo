import type { GenderColumns } from "./GendersColumns";


export interface UserColumns{
  user_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender_id?: number | string;
  gender: GenderColumns | number | string;
  birth_date: string;
  age: number | string;
  username: string;
  password: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}
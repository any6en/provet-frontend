export interface IPatient {
  id: number;
  owner_id: number | undefined;
  nickname: string;
  breed_id: number;
  animal_type_id: number;
  date_birth: string;
  age: number;
  gender: number;
  created_at: string;
  breed_name: string;
  animal_type_name: string;
}

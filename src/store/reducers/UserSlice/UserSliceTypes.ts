export interface IOwner {
  id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  address: string;
  date_birth: string;
  gender: number;
  created_at: string;
}

export interface IPatient {
  id: number;
  nickname: string;
  breed_id: number;
  owner_id: number | undefined;
  animal_type_id: number;
  date_birth: string;
  age: number;
  gender: number;
  created_at: string;
}

export interface IBreed {
  id: number;
  name: string;
  animal_type_id: number;
}

export interface IAnimalType {
  id: number;
  name: string;
}

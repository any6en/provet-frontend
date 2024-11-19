export interface IOwner {
  id: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  address: string;
  date_birth: string;
  gender: number;
  created_at: string;

  passport_series: string;
  passport_number: string;
  issued_by: string;
  subdivision_code: string;
  issue_date: string;
  pd_agreement_signed: boolean;
  date_pd_agreement_sign: boolean;
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

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
  breedId: number;
  animalTypeId: number;
  dateBirth: string;
  age: number;
  gender: number;
  createdAt: string;
}

export interface IBreed {
  id: number;
  name: string;
  animalTypeId: number;
}

export interface IAnimalType {
  id: number;
  name: string;
}

export interface IOwner {
  id: number;
  lastName: string;
  firstName: string;
  patronymic: string;
  address: string;
  dateBirth: string;
  gender: number;
  createdAt: string;
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

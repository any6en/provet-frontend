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
  name: string;
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

export interface ISpecie {
  id: number;
  name: string;
}

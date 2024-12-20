import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IBreed, IOwner, IPatient, IAnimalType } from './UserSliceTypes';

interface UserState {
  isReloadTable: boolean;

  modalChangeOwner: boolean;
  modalAddOwner: boolean;
  selectedOwner: IOwner | null;

  modalChangePatient: boolean;
  modalAddPatient: boolean;
  selectedPatient: IPatient | null;

  modalChangeBreed: boolean;
  modalAddBreed: boolean;
  selectedBreed: IBreed | null;
  selectedBreedIdForParent: number | null;

  modalChangeAnimalType: boolean;
  modalAddAnimalType: boolean;
  selectedAnimalType: IAnimalType | null;
  selectedAnimalTypeIdForParent: number | null;

  modalChangePrimaryVisit: boolean;
  modalAddPrimaryVisit: boolean;

  selectedPrimaryVisit: any | null;

  modalChangeRepeatVisit: boolean;
  modalAddRepeatVisit: boolean;

  selectedRepeatVisit: any | null;

  modalSelectVisitType: boolean;

  modalAddSurgicalIntervention: boolean;
  modalChangeSurgicalIntervention: boolean;
}

const initialState: UserState = {
  isReloadTable: false,

  // Состояния для форм Владельцы
  modalChangeOwner: false,
  modalAddOwner: false,
  selectedOwner: null,

  // Состояния для форм Пациенты
  modalChangePatient: false,
  modalAddPatient: false,
  selectedPatient: null,

  // Состояния для форм Виды
  modalChangeAnimalType: false,
  modalAddAnimalType: false,
  selectedAnimalType: null,
  selectedAnimalTypeIdForParent: null,

  // Состояния для форм Породы
  modalChangeBreed: false,
  modalAddBreed: false,
  selectedBreed: null,
  selectedBreedIdForParent: null,

  // Состояния для форм Визиты
  modalChangePrimaryVisit: false,
  modalAddPrimaryVisit: false,

  selectedPrimaryVisit: null,

  // Состояния для формы повторного приема
  modalChangeRepeatVisit: false,
  modalAddRepeatVisit: false,

  selectedRepeatVisit: null,

  modalSelectVisitType: false,

  modalAddSurgicalIntervention: false,
  modalChangeSurgicalIntervention: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Для перезагрузки таблиц
    setIsReloadTable(state, action: PayloadAction<boolean>) {
      state.isReloadTable = action.payload;
    },

    // Состояния методы для форм Владельцы
    setShowModalChangeOwner(state, action: PayloadAction<boolean>) {
      state.modalChangeOwner = action.payload;
    },
    setSelectedOwner(state, action: PayloadAction<IOwner | null>) {
      state.selectedOwner = action.payload;
    },
    setShowModalAddOwner(state, action: PayloadAction<boolean>) {
      state.modalAddOwner = action.payload;
    },

    // Состояния методы для форм Пациенты
    setShowModalChangePatient(state, action: PayloadAction<boolean>) {
      state.modalChangePatient = action.payload;
    },
    setShowModalAddPatient(state, action: PayloadAction<boolean>) {
      state.modalAddPatient = action.payload;
    },
    setSelectedPatient(state, action: PayloadAction<any | null>) {
      state.selectedPatient = action.payload;
    },

    // Состояния методы для форм Виды
    setShowModalChangeAnimalType(state, action: PayloadAction<boolean>) {
      state.modalChangeAnimalType = action.payload;
    },
    setShowModalAddAnimalType(state, action: PayloadAction<boolean>) {
      state.modalAddAnimalType = action.payload;
    },
    setSelectedAnimalType(state, action: PayloadAction<IAnimalType | null>) {
      state.selectedAnimalType = action.payload;
    },
    setSelectedAnimalTypeIdForParent(state, action: PayloadAction<number | null>) {
      state.selectedAnimalTypeIdForParent = action.payload;
    },

    // Состояния для форм Породы
    setShowModalChangeBreed(state, action: PayloadAction<boolean>) {
      state.modalChangeBreed = action.payload;
    },
    setShowModalAddBreed(state, action: PayloadAction<boolean>) {
      state.modalAddBreed = action.payload;
    },
    setSelectedBreed(state, action: PayloadAction<IBreed | null>) {
      state.selectedBreed = action.payload;
    },
    setSelectedBreedIdForParent(state, action: PayloadAction<number | null>) {
      state.selectedBreedIdForParent = action.payload;
    },

    // Состояния для форм Визиты
    setShowModalChangePrimaryVisit(state, action: PayloadAction<boolean>) {
      state.modalChangePrimaryVisit = action.payload;
    },
    setShowModalAddPrimaryVisit(state, action: PayloadAction<boolean>) {
      state.modalAddPrimaryVisit = action.payload;
    },
    setSelectedPrimaryVisit(state, action: PayloadAction<any | null>) {
      state.selectedPrimaryVisit = action.payload;
    },

    // Состояния для формы повторого приема
    setShowModalChangeRepeatVisit(state, action: PayloadAction<boolean>) {
      state.modalChangeRepeatVisit = action.payload;
    },
    setShowModalAddRepeatVisit(state, action: PayloadAction<boolean>) {
      state.modalAddRepeatVisit = action.payload;
    },
    setSelectedRepeatVisit(state, action: PayloadAction<any | null>) {
      state.selectedRepeatVisit = action.payload;
    },
    setShowModalSelectVisitType(state, action: PayloadAction<boolean>) {
      state.modalSelectVisitType = action.payload;
    },
    setShowModalAddSurgicalIntervention(state, action: PayloadAction<boolean>) {
      state.modalAddSurgicalIntervention = action.payload;
    },
    setShowModalChangeSurgicalIntervention(state, action: PayloadAction<boolean>) {
      state.modalChangeSurgicalIntervention = action.payload;
    },
  },
});

export default userSlice.reducer;

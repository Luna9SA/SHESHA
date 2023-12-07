import {createSlice} from '@reduxjs/toolkit';

export const TypeOfEmploy = createSlice({
  name: 'TypeOfEmploy',
  initialState: {
    Type: '',
    FileOrSlipType: '',
    Terminated: '',
    AddEmployJson: undefined,
    AddProfile: undefined,
    registerAdPVOrBs: undefined,
  },
  reducers: {
    selectEmployType: (state, action) => {
      state.Type = action.payload;
    },
    selectFileOrPayType: (state, action) => {
      state.FileOrSlipType = action.payload;
    },
    selectTerminatedType: (state, action) => {
      state.Terminated = action.payload;
    },
    setAddEmployJson: (state, action) => {
      state.AddEmployJson = action.payload;
    },
    setAddProfile: (state, action) => {
      state.AddProfile = action.payload;
    },
    setRegisterAdPVOrBs: (state, action) => {
      console.log('====================================');
      console.log('registerAdPVOrBs : ', action?.payload);
      console.log('====================================');
      state.registerAdPVOrBs = action.payload;
    },
  },
});

export const {
  selectEmployType,
  selectFileOrPayType,
  selectTerminatedType,
  setAddEmployJson,
  setAddProfile,
  setRegisterAdPVOrBs,
} = TypeOfEmploy.actions;
export const stateOfTypeEmploy = state => state.TypeOfEmploy.Type;
export const stateOfFileOrSlip = state => state.TypeOfEmploy.FileOrSlipType;
export const stateOfTerminated = state => state.TypeOfEmploy.Terminated;
export const stateAddEmployJson = state => state.TypeOfEmploy.AddEmployJson;
export const stateAddProfile = state => state.TypeOfEmploy.AddProfile;

export default TypeOfEmploy.reducer;

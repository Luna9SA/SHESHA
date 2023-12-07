import {createSlice} from '@reduxjs/toolkit';

export const UserDataSlice = createSlice({
  name: 'UserDataSlice',
  initialState: {
    data: undefined,
    token: undefined,
    Who_login: undefined,
    rememberEmailEmployer: '',
    rememberPasswordEmployer: '',
    rememberPhoneNumberEmployee: '',
    rememberPasswordEmployee: '',
    Banks: undefined,
    Account_Type: undefined,
    CompanyName: undefined,
  },
  reducers: {
    userOfData: (state, action) => {
      state.data = action.payload;
    },
    userToken: (state, action) => {
      state.token = action.payload;
    },
    whoLogin: (state, action) => {
      state.Who_login = action.payload;
    },
    userEmployerRemember: (state, action) => {
      (state.rememberEmailEmployer = action?.payload?.email),
        (state.rememberPasswordEmployer = action?.payload?.password);
    },
    userEmployeeRemember: (state, action) => {
      (state.rememberPhoneNumberEmployee = action?.payload?.phone),
        (state.rememberPasswordEmployee = action?.payload?.password);
    },
    setAllBankAndAccountTypeData: (state, action) => {
      (state.Banks = action?.payload?.banks),
        (state.Account_Type = action?.payload?.account_type);
    },
    setCompanyNameData: (state, action) => {
      state.CompanyName = action?.payload;
    },
  },
});

export const {
  userOfData,
  userToken,
  whoLogin,
  userEmployeeRemember,
  userEmployerRemember,
  setAllBankAndAccountTypeData,
  setCompanyNameData,
} = UserDataSlice.actions;
export const stateOfUserData = state => state.UserDataSlice.data;
export const stateOfToken = state => state.UserDataSlice.token;
export const stateOfWhoLogin = state => state.UserDataSlice.Who_login;

export default UserDataSlice.reducer;

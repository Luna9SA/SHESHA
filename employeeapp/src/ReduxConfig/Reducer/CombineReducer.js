import {combineReducers} from 'redux';
import {TypeOfEmploy} from '../Slice/TypeofEmploy';
import {UserDataSlice} from '../Slice/UserDataSlice';

const rootReducer = combineReducers({
  TypeOfEmp: TypeOfEmploy.reducer,
  UserData : UserDataSlice.reducer,
});

export default rootReducer;

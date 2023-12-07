import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ScreenName} from './ScreenName';
import SplashScreen from '../Screens/Splash/Splash';
import WelcomeScreen from '../Screens/Welcome/Welcome';
import ChooseLoginType from '../Screens/Auth/Login/ChooseLoginType';
import ChooseEmployee from '../Screens/Types/ChooseEmploye';
import LoginScreen from '../Screens/Auth/Login/Login';
import ForgotPassword from '../Screens/Auth/ForgotPassword/ForgotPassword';
import RegisterScreen from '../Screens/Auth/Register/Register';
import TermsAndCondition from '../Screens/TRD/TremAndCondition';
import EmployHome from '../Screens/EmployeeOrEmployerApp/EmployeeHome/EmployHome';
import FileScreen from '../Screens/EmployeeOrEmployerApp/FilesView/FileScreen';
import ShareView from '../Screens/EmployeeOrEmployerApp/ShareView/ShareView';
import PaySlipView from '../Screens/EmployeeOrEmployerApp/PaySlipView/PaySlipView';
import DaysLeave from '../Screens/EmployeeOrEmployerApp/DayLeaves/DayLeaves';
import LogOut from '../Screens/Auth/Logout/LogOut';
import NotificationView from '../Screens/EmployeeOrEmployerApp/Notification/NotificationView';
import FullNotificationView from '../Screens/EmployeeOrEmployerApp/Notification/FullNotificationView';
import EmployerHome from '../Screens/EmployeeOrEmployerApp/EmployerHome/EmployerHome';
import EmployerProfile from '../Screens/EmployeeOrEmployerApp/EmployerHome/EmployerProfile';
import AddNewEmploye from '../Screens/EmployeeOrEmployerApp/AddNewEmployee/AddNewEmploye';
import MyProfileScreen from '../Screens/MyProfile/MyProfile';
import UpdateProfile from '../Screens/MyProfile/UpdateProfile';
import DeleteAccount from '../Screens/EmployeeOrEmployerApp/DeleteAccount/DeleteAccount';
import Termination from '../Screens/EmployeeOrEmployerApp/TerminationProcess/Termination';
import ReasonsTermination from '../Screens/EmployeeOrEmployerApp/TerminationProcess/ReasonsTermination';
import TerminatoinDoc from '../Screens/EmployeeOrEmployerApp/TerminationProcess/TerminatoinDoc';
import JobDetailsOfTitle from '../Screens/EmployeeOrEmployerApp/JobDetailsOfTitle.js/JobDetailsOfTitle';
import WorkDay from '../Screens/EmployeeOrEmployerApp/JobDetailsOfTitle.js/WorkDay';
import PattenOfWork from '../Screens/EmployeeOrEmployerApp/JobDetailsOfTitle.js/PattenOfWork';
import TermAndCondition from '../Screens/EmployeeOrEmployerApp/JobDetailsOfTitle.js/TermAndConditon';
import EmployeeForgotPassword from '../Screens/Auth/ForgotPassword/EmployeeForgotPassword';
import AddDayLeave from '../Screens/EmployeeOrEmployerApp/DayLeaves/AddDayLeave';
import PdfViewer from '../Screens/EmployeeOrEmployerApp/ShareView/PdfViewer';
import SelectLeaveType from '../Screens/EmployeeOrEmployerApp/DayLeaves/LeaveTypes';
import EditLeave from '../Screens/EmployeeOrEmployerApp/DayLeaves/EditLeave';
import EmployeeUpdateProfile from '../Screens/EmployeeOrEmployerApp/EmployerHome/EmployeeUpdateProfile';
import ViewOrEditLeave from '../Screens/EmployeeOrEmployerApp/DayLeaves/ViewOrEdit';
import Webview from '../Screens/Webview/Webview';

const Stack = createStackNavigator();

export default function ScreenNavigation() {
  return (
    <Stack.Navigator initialRouteName={ScreenName.Splash}>
      <Stack.Screen
        name={ScreenName.Splash}
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.Welcome}
        component={WelcomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.ChooseEmployee}
        component={ChooseEmployee}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.ChooseLoginType}
        component={ChooseLoginType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.LoginScreen}
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.ForgotPassword}
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.RegisterScreen}
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.TermsAndCondition}
        component={TermsAndCondition}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.EmployHome}
        component={EmployHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.FileScreen}
        component={FileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.ShareView}
        component={ShareView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.PaySlipView}
        component={PaySlipView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.DaysLeave}
        component={DaysLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.LogOut}
        component={LogOut}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.NotificationView}
        component={NotificationView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.FullNotificationView}
        component={FullNotificationView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.EmployerHome}
        component={EmployerHome}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.EmployerProfile}
        component={EmployerProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.AddNewEmployee}
        component={AddNewEmploye}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.MyProfile}
        component={MyProfileScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.UpdateProfile}
        component={UpdateProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.DeleteAccount}
        component={DeleteAccount}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.Termination}
        component={Termination}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.ReasonsTermination}
        component={ReasonsTermination}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.TerminatoinDoc}
        component={TerminatoinDoc}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.JobDetailsTitle}
        component={JobDetailsOfTitle}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.WorkDay}
        component={WorkDay}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.PattenOfWork}
        component={PattenOfWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.TermAndCondition}
        component={TermAndCondition}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.EmployeeForgotPassword}
        component={EmployeeForgotPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.AddDayLeave}
        component={AddDayLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.PdfViewer}
        component={PdfViewer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.LeaveType}
        component={SelectLeaveType}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.EditLeave}
        component={EditLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.EditEmployeeProfile}
        component={EmployeeUpdateProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.ViewOrEditLeave}
        component={ViewOrEditLeave}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={ScreenName.Webview}
        component={Webview}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

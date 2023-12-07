import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectEmployType} from '../../../ReduxConfig/Slice/TypeofEmploy';
import CommonScreen from '../../../Components/CommanScreen';
import i18n from '../../../themes/i18n';
import {colors} from '../../../themes';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import CommonTextInput from '../../../Components/CommanTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import {
  EmailValidation,
  PassWordValidation,
  PhoneNumberValidation,
} from '../../../Comman/validation';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {
  EMPLOYEE_LOGIN,
  EMPLOYER_LOGIN,
  GET_STATIC_DATA,
} from '../../../Apis/Api';
import {
  setAllBankAndAccountTypeData,
  stateOfToken,
  stateOfUserData,
  userEmployeeRemember,
  userEmployerRemember,
  userOfData,
  userToken,
  whoLogin,
} from '../../../ReduxConfig/Slice/UserDataSlice';
import CommanLoader from '../../../Components/CommanLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images from '../../../themes/images';

export default function LoginScreen() {
  //ReduxState
  const dispatch = useDispatch();
  const TypeOfEmploy = useSelector(selectEmployType);
  const rememberEmailEmployer = useSelector(userOfData);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  //useState
  const [Email, setEmail] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Password, setPassword] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  //setValue
  useEffect(() => {
    if (rememberEmailEmployer?.payload?.UserData) {
      setEmail(rememberEmailEmployer?.payload?.UserData?.rememberEmailEmployer);
      if (typeOfEmployState == i18n.Employer) {
        setPassword(
          rememberEmailEmployer?.payload?.UserData?.rememberPasswordEmployer,
        );
      } else {
        setPassword(
          rememberEmailEmployer?.payload?.UserData?.rememberPasswordEmployee,
        );
      }

      setMobile(
        rememberEmailEmployer?.payload?.UserData?.rememberPhoneNumberEmployee,
      );
    }
  }, [rememberEmailEmployer]);

  //onLoginButton
  const onLoginButton = () => {
    if (typeOfEmployState == i18n.Employee) {
      // NavigationService.resetAndRedirect(ScreenName.EmployHome);
      const Phone_validation = PhoneNumberValidation(Mobile);
      const Password_validation = PassWordValidation(Password);
      if (Phone_validation || Password_validation) {
        AlertBox({
          Title: i18n.Alert,
          Message: Phone_validation || Password_validation,
        });
      } else {
        letDoLoginEmployee();
      }
    }
    if (typeOfEmployState == i18n.Employer) {
      const Email_validation = EmailValidation(Email);
      const Password_validation = PassWordValidation(Password);
      if (Email_validation || Password_validation) {
        AlertBox({
          Title: i18n.Alert,
          Message: Email_validation || Password_validation,
        });
      } else {
        letDoLoginEmployer();
      }
    }
  };

  //letDoLoginEmployer
  const letDoLoginEmployer = async () => {
    const fcm_token = await AsyncStorage.getItem('fcmtoken');
    setIsLoader(true);
    const params = {
      email: Email.trim(),
      password: Password.trim(),
      fcm_token: fcm_token,
    };
    console.log("letDoLoginEmployer ", params);
    const isNet = await netWorkCheck();
    if (isNet) {
      Post_Api(EMPLOYER_LOGIN, params)
        .then(value => {
          setIsLoader(false);
          console.log('Post_Api ::: ', value?.data);
          if (value?.data) {
            global.AccessToken = value?.data?.token;
            setTheRememberData();
            getAllBankStoreData();
            dispatch(userOfData(value?.data));
            dispatch(userToken(value?.data?.token));
            dispatch(whoLogin(i18n.Employer));
            setEmail('');
            setPassword('');
            NavigationService.resetAndRedirect(ScreenName.EmployerHome);
          }
        })
        .catch(error => {
          setIsLoader(false);
          console.log(error);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //letDoLoginEmployee
  const letDoLoginEmployee = async () => {
    const fcm_token = await AsyncStorage.getItem('fcmtoken');

    setIsLoader(true);
    const params = {
      phonenumber: Mobile.trim(),
      password: Password.trim(),
      fcm_token: fcm_token,
    };
    const isNet = await netWorkCheck();
    if (isNet) {
      Post_Api(EMPLOYEE_LOGIN, params)
        .then(value => {
          setIsLoader(false);
          console.log('Post_Api ::: ', value?.data);
          if (value?.data) {
            global.AccessToken = value?.data?.token;
            setTheRememberData();
            getAllBankStoreData();
            dispatch(userOfData(value?.data));
            dispatch(userToken(value?.data?.token));
            dispatch(whoLogin(i18n.Employee));
            setEmail('');
            setPassword('');
            NavigationService.resetAndRedirect(ScreenName.EmployHome);
          }
        })
        .catch(error => {
          setIsLoader(false);
          console.log(error);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //getAllBankStoreData
  const getAllBankStoreData = async () => {
    setIsLoader(true);
    const isNet = await netWorkCheck();
    if (isNet) {
      Post_Api(GET_STATIC_DATA, '')
        .then(value => {
          setIsLoader(false);
          console.log('Post_Api ::: ', value?.data);
          dispatch(setAllBankAndAccountTypeData(value?.data));
        })
        .catch(error => {
          setIsLoader(false);
          console.log(error);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //onFPress
  const onFPress = () => {
    typeOfEmployState == i18n.Employer
      ? NavigationService.navigate(ScreenName.ForgotPassword)
      : NavigationService.navigate(ScreenName.EmployeeForgotPassword);
  };

  //setTheRememberData
  const setTheRememberData = () => {
    console.log('====================================');
    console.log(Email, Mobile, Password);
    console.log('====================================');
    if (isRemember) {
      if (typeOfEmployState == i18n.Employer) {
        const json = {
          email: Email,
          password: Password,
        };
        dispatch(userEmployerRemember(json));
      } else {
        const json = {
          phone: Mobile,
          password: Password,
        };
        dispatch(userEmployeeRemember(json));
      }
    }
  };

  return (
    <CommonScreen
      BackgroundColor={
        typeOfEmployState == i18n.Employer ? colors.colorRed : colors.yellow
      }
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <KeyboardAwareScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              style={styles.P1}>
              {typeOfEmployState == i18n.Employer && (
                <View>
                  <Text style={styles.HText}>{i18n.EmailAddress}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.EmailPlaceHolder}
                    Value={Email}
                    onChange={t => setEmail(t)}
                    keyboardType={'email-address'}
                  />
                </View>
              )}
              {typeOfEmployState == i18n.Employee && (
                <View>
                  <Text style={styles.HText}>{i18n.EnterPhone}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.PhonePlaceHolder}
                    Value={Mobile}
                    onChange={t => setMobile(t)}
                    keyboardType={'number-pad'}
                  />
                </View>
              )}
              <View style={styles.M1}>
                <Text style={styles.HText}>{i18n.EnterPassword}</Text>
                <CommonTextInput
                  PlaceHolder={'********'}
                  Value={Password}
                  onChange={t => setPassword(t)}
                  secureTextEntry={true}
                />
              </View>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <TouchableOpacity
                  style={styles.box}
                  onPress={() => {
                    setIsRemember(!isRemember);
                  }}>
                  {isRemember && (
                    <Image
                      source={images.Check}
                      style={{
                        height: verticalScale(10),
                        width: verticalScale(12),
                        alignSelf: 'center',
                      }}
                    />
                  )}
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: 10,
                    alignSelf: 'center',
                    color: colors.colorBlack,
                  }}>
                  Remember me
                </Text>
              </View>
              <View style={styles.M2}>
                <CommonButton
                  Title={i18n.Login}
                  OnPress={() => onLoginButton()}
                />
              </View>
              <Text style={styles.FText} onPress={() => onFPress()}>
                {i18n.ForgotPassword}
              </Text>
              <View style={styles.M2}>
                <CommonButton
                  Title={i18n.GoBack}
                  OnPress={() => NavigationService.goBack()}
                />
              </View>
            </KeyboardAwareScrollView>
            <CommanLoader isVisible={isLoader} />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    backgroundColor: colors.colorWhite,
  },
  P1: {
    paddingTop: verticalScale(50),
  },
  HText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.colorBlack,
  },
  M1: {
    marginTop: verticalScale(20),
  },
  M2: {
    marginTop: verticalScale(30),
  },
  FText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.colorBlack,
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
  box: {
    height: verticalScale(24),
    width: verticalScale(24),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.colorGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

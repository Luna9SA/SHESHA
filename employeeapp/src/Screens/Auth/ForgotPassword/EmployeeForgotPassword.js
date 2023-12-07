import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CommonScreen from '../../../Components/CommanScreen';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import {selectEmployType} from '../../../ReduxConfig/Slice/TypeofEmploy';
import i18n from '../../../themes/i18n';
import CommonTextInput from '../../../Components/CommanTextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import CommonLogo from '../../../Components/CommanLogo';
import {ScreenName} from '../../../Navigation/ScreenName';
import {
  ConformPasswordValidation,
  EmailValidation,
  PassWordValidation,
  PhoneNumberValidation,
} from '../../../Comman/validation';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {
  EMPLOYEE_FORGOT_PASSWORD,
  EMPLOYEE_First_Login,
  EMPLOYEE_OTP_VERIFY,
  EMPLOYEE_RESET_PASSWORD,
  EMPLOYER_FORGOT_PASSWORD,
  EMPLOYER_OTP_VERIFY,
  EMPLOYER_RESET_PASSWORD,
} from '../../../Apis/Api';
import CommanLoader from '../../../Components/CommanLoader';
import images from '../../../themes/images';

export default function EmployeeForgotPassword(props) {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  //STATE
  const [EmailOrPhone, setEmailOrPhone] = useState('');
  const [Otp, setOtp] = useState('');
  const [isOtpScreen, setIsOtpScreen] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [CnewPassword, setCNewPassword] = useState('');
  const [FirstLogin, setFirstLogin] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [isNet, setIsNet] = useState(false);
  const [isTRD, setIdTRD] = useState(false);
  const [EmployerEmailVerify, setEmployerEmailVerify] = useState(false);
  const [EmployePhoneVerify, setEmployePhoneVerifyy] = useState(false);

  //PropsWithUseMemo
  useEffect(() => {
    setFirstLogin(props?.route?.params);
    fetchNet();
  }, [props]);

  //fetchNet
  const fetchNet = async () => {
    const isnet = await netWorkCheck();
    setIsNet(isnet);
  };

  //OnGoBack
  const OnGoBack = () => {
    NavigationService.goBack();
  };

  //onNextButton
  const onNextButton = () => {
    const Email = EmailOrPhone;
    const Email_validation = PhoneNumberValidation(Email);
    const PassValidation = PassWordValidation(newPassword);
    const ConformPassValidation = ConformPasswordValidation(
      newPassword,
      CnewPassword,
    );

    if (Email_validation && !isOtpScreen) {
      AlertBox({Title: i18n.Alert, Message: Email_validation});
    }
    if (!Email_validation && !isOtpScreen && !EmployerEmailVerify) {
      fetchOtpFromEmail();
    }
    if (isOtpScreen && Otp == '') {
      AlertBox({Title: i18n.Alert, Message: 'Please Enter Your Otp'});
    }
    if (isOtpScreen && Otp != '' && !isChangePassword) {
      verifyTheOtp();
    }

    if (isChangePassword) {
      if (PassValidation || ConformPassValidation) {
        AlertBox({
          Title: i18n.Alert,
          Message: PassValidation || ConformPassValidation,
        });
      } else {
        letsDoForgotPassword();
      }
    }
  };

  //letsDoForgotPassword
  const letsDoForgotPassword = () => {
    setIsLoader(true);
    const params = {
      phonenumber: EmailOrPhone,
      password: newPassword,
      confirm_password: CnewPassword,
    };
    console.log('letsDoForgotPassword : ', params);
    if (isNet) {
      Post_Api(EMPLOYEE_RESET_PASSWORD, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            // setIsOtpScreen(true);
            AlertBox({
              Title: i18n.Alert,
              Message: value?.message,
              onOkPress: () => {
                NavigationService.goBack();
                setIsOtpScreen(false),
                  setIsChangePassword(false),
                  setEmployerEmailVerify(false);
              },
            });
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //fetchOtpFromEmail
  const fetchOtpFromEmail = () => {
    setIsLoader(true);
    const params = {
      phonenumber: EmailOrPhone,
    };
    console.log('fetchOtpFromEmail : ', params);
    if (isNet) {
      Post_Api(EMPLOYEE_FORGOT_PASSWORD, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            // setIsOtpScreen(true);
            AlertBox({
              Title: i18n.Alert,
              Message: value?.message,
              onOkPress: () => {
                setIsOtpScreen(true), setEmployerEmailVerify(true);
              },
            });
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //verifyTheOtp
  const verifyTheOtp = () => {
    setIsLoader(true);
    const params = {
      phonenumber: EmailOrPhone,
      otp: Otp,
    };
    console.log('verifyTheOtp : ', params);

    if (isNet) {
      Post_Api(EMPLOYEE_OTP_VERIFY, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            AlertBox({
              Title: i18n.Alert,
              Message: value?.message,
              onOkPress: () => {
                setIsChangePassword(true);
                setIsOtpScreen(false);
              },
            });
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
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
            {!isOtpScreen && !isChangePassword && (
              <KeyboardAwareScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={styles.P1}>
                <View>
                  <Text style={styles.HText}>{i18n.EnterPhone}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.PhonePlaceHolder}
                    Value={EmailOrPhone}
                    onChange={t => setEmailOrPhone(t)}
                    keyboardType={'number-pad'}
                  />
                </View>
                <View style={styles.M2}>
                  <CommonButton
                    Title={i18n.Next}
                    OnPress={() => onNextButton()}
                  />
                </View>
              </KeyboardAwareScrollView>
            )}
            {isOtpScreen && !isChangePassword && (
              <KeyboardAwareScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={styles.P1}>
                {typeOfEmployState == i18n.Employer && (
                  <View>
                    <Text style={[styles.HText, {alignSelf: 'center'}]}>
                      {i18n.OtpFromEmployer}
                    </Text>
                  </View>
                )}
                {typeOfEmployState == i18n.Employee && (
                  <View>
                    <Text style={styles.HText}>{i18n.OtpFromEmploy}</Text>
                  </View>
                )}
                <CommonTextInput
                  PlaceHolder={i18n.OTP}
                  Value={Otp}
                  onChange={t => setOtp(t)}
                  keyboardType={'number-pad'}
                  Otp={isOtpScreen}
                />
                <View style={styles.M2}>
                  <CommonButton
                    Title={i18n.Next}
                    OnPress={() => onNextButton()}
                  />
                </View>
              </KeyboardAwareScrollView>
            )}
            {isChangePassword && (
              <KeyboardAwareScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                style={styles.P1}>
                <View>
                  <Text style={[styles.HText]}>{i18n.CreateNewPassword}</Text>
                </View>
                <CommonTextInput
                  PlaceHolder={'*****'}
                  Value={newPassword}
                  secureTextEntry={true}
                  onChange={t => setNewPassword(t)}
                />
                <View>
                  <Text style={[styles.HText]}>{i18n.ConfirmNewPassword}</Text>
                </View>
                <CommonTextInput
                  PlaceHolder={'*****'}
                  secureTextEntry={true}
                  Value={CnewPassword}
                  onChange={t => setCNewPassword(t)}
                />
                {FirstLogin === i18n.FLogin && (
                  <View style={styles.TndCView}>
                    <TouchableOpacity
                      style={styles.Box}
                      onPress={() => setIdTRD(!isTRD)}>
                      {isTRD && (
                        <Image
                          source={images.Check}
                          style={styles.CheckImage}
                        />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.Accept}>{i18n.Accept}</Text>
                    <Text
                      style={styles.TD}
                      onPress={() => {
                        NavigationService.navigate(
                          ScreenName.TermsAndCondition,
                        );
                      }}>
                      {i18n.TermsConditions}
                    </Text>
                  </View>
                )}
                <View style={styles.M2}>
                  <CommonButton
                    Title={i18n.Next}
                    isDisable={FirstLogin == i18n.FLogin && !isTRD}
                    OnPress={() => onNextButton()}
                  />
                </View>
              </KeyboardAwareScrollView>
            )}
            {!isOtpScreen && !isChangePassword && (
              <CommonButton Title={i18n.GoBack} OnPress={() => OnGoBack()} />
            )}
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
    paddingTop: verticalScale(100),
  },
  HText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.colorBlack,
  },
  M1: {
    marginTop: verticalScale(140),
  },
  M2: {
    marginTop: verticalScale(30),
  },
  TndCView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: moderateVerticalScale(20),
  },
  Box: {
    height: verticalScale(30),
    width: verticalScale(30),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.colorGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Accept: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.colorBlack,
    marginLeft: verticalScale(8),
    alignSelf: 'center',
  },
  TD: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.colorRed,
    marginLeft: verticalScale(4),
    alignSelf: 'center',
  },
  CheckImage: {
    height: verticalScale(12),
    width: verticalScale(16),
  },
});

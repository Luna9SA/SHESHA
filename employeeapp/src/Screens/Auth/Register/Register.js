import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import TypeofEmploy, {
  selectEmployType,
} from '../../../ReduxConfig/Slice/TypeofEmploy';
import CommonScreen from '../../../Components/CommanScreen';
import {colors} from '../../../themes';
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import CommonTextInput from '../../../Components/CommanTextInput';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ScreenName} from '../../../Navigation/ScreenName';
import {
  ConformPasswordValidation,
  EmailValidation,
  FirstNameValidation,
  FullAddressValidation,
  GenderTitleValidation,
  LastNameValidation,
  PassWordValidation,
  PhoneNumberValidation,
} from '../../../Comman/validation';
import {
  AlertBox,
  netWorkCheck,
  onSearchAddress,
} from '../../../Comman/constant';
import images from '../../../themes/images';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {EMPLOYER_LOGIN, EMPLOYER_REGISTER} from '../../../Apis/Api';
import CommanLoader from '../../../Components/CommanLoader';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {setCompanyNameData} from '../../../ReduxConfig/Slice/UserDataSlice';

export default function RegisterScreen() {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;
  const {TypeOfEmp} = useSelector(TypeofEmploy => TypeofEmploy);
  const dispatch = useDispatch();
  //State
  const [Title, setTitle] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');
  const [Email, setEmail] = useState('');
  const [FullAddress, setFullAddress] = useState('');
  const [isNext, setIsNext] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [CnewPassword, setCNewPassword] = useState('');
  const [isConformTrd, setConformTrd] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isNet, setIsNet] = useState(false);
  const [CompanyName, setCompanyName] = useState('');
  const [onAddressFocus, setOnAddressFocus] = useState(false);

  //handleFocus
  const handleFocus = t => {
    setOnAddressFocus(true);
  };

  //PROPS USE EFFECT
  useEffect(() => {
    internetCheck();
  }, []);

  //internetCheck
  const internetCheck = async () => {
    const isnet = await netWorkCheck();
    setIsNet(isnet);
  };

  //onNextPress
  const onNextPress = () => {
    const TitleValidation = GenderTitleValidation(Title);
    const FirstValidation = FirstNameValidation(FirstName);
    const LastValidation = LastNameValidation(LastName);
    const PhoneValidation = PhoneNumberValidation(MobileNumber);
    const Email_validation = EmailValidation(Email);
    const FullValidation = FullAddressValidation(FullAddress);
    const PassValidation = PassWordValidation(newPassword);
    const ConformPassValidation = ConformPasswordValidation(
      newPassword,
      CnewPassword,
    );

    if (!isNext) {
      if (TitleValidation || FirstValidation || LastValidation) {
        AlertBox({
          Title: i18n.Alert,
          Message: TitleValidation || FirstValidation || LastValidation,
        });
      } else {
        setIsNext(true);
      }
    } else if (!isChangePassword) {
      if (PhoneValidation || Email_validation || FullValidation) {
        AlertBox({
          Title: i18n.Alert,
          Message: PhoneValidation || Email_validation || FullValidation,
        });
      } else if (
        TypeOfEmp?.registerAdPVOrBs != 'private' &&
        CompanyName == ''
      ) {
        AlertBox({
          Title: i18n.Alert,
          Message: 'Please Add The Company Name.',
        });
      } else {
        setIsChangePassword(true);
      }
    } else {
      if (PassValidation || ConformPassValidation) {
        AlertBox({
          Title: i18n.Alert,
          Message: PassValidation || ConformPassValidation,
        });
      } else {
        letsDoRegister();
      }
    }
  };
  console.log('TypeOfEmp : ', TypeOfEmp?.registerAdPVOrBs);
  //letsDoRegister
  const letsDoRegister = () => {
    const params = {
      title: Title.trim(),
      first_name: FirstName.trim(),
      last_name: LastName.trim(),
      mobile_number: MobileNumber.trim(),
      email: Email.trim(),
      address: FullAddress,
      password: newPassword.trim(),
      terms_and_condition: isConformTrd ? 1 : 0,
      employer_type: TypeOfEmp?.registerAdPVOrBs,
      company_name: CompanyName,
    };
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_REGISTER, params)
        .then(Value => {
          setIsLoader(false);
          if (Value?.data) {
            dispatch(setCompanyNameData(CompanyName));
            AlertBox({
              Title: i18n.Alert,
              Message: 'Registration Successful.',
              onOkPress: () => {
                NavigationService.navigate(ScreenName.LoginScreen);
              },
            });
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.internetCheck});
    }
  };

  //onPressTRD
  const onPressTRD = () => {
    NavigationService.navigate(ScreenName.TermsAndCondition);
  };

  //onGoBack
  const onGoBack = () => {
    if (isNext && !isChangePassword) {
      setIsNext(false);
    }
    if (isChangePassword && isNext) {
      setIsChangePassword(false);
    }
    if (!isNext && !isChangePassword) {
      NavigationService.goBack();
    }
  };

  //returnDisableValue
  const returnDisableValue = () => {
    if (!isNext || !isChangePassword) {
      return false;
    } else if (isConformTrd) {
      return false;
    } else {
      return true;
    }
  };

  //onSearchAddress
  const [searchArray, setSearchArray] = useState([]);
  const onChangeSearchAddress = async t => {
    setFullAddress(t);
    let data = await onSearchAddress(t);
    setSearchArray(data);
    console.log(data);
  };

  return (
    <CommonScreen
      BackgroundColor={colors.colorRed}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />

            <TouchableWithoutFeedback
              onPress={() => {
                setOnAddressFocus(false);
              }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={[
                  styles.M1,
                  onAddressFocus && {
                    marginBottom:
                      Platform.OS == 'ios' ? verticalScale(250) : 10,
                  },
                ]}
                // bounces={false}
              >
                <View style={styles.M2}>
                  {!isNext && !isChangePassword && (
                    <View>
                      <Text style={styles.HText}>{i18n.title}</Text>
                      <CommonTextInput
                        Value={Title.trim()}
                        onChange={t => setTitle(t)}
                        PlaceHolder={i18n.TitlePlaceHolder}
                      />
                      <Text style={styles.HText}>{i18n.FirstName}</Text>
                      <CommonTextInput
                        Value={FirstName.trim()}
                        onChange={t => setFirstName(t)}
                        PlaceHolder={i18n.FPlaceHolder}
                      />
                      <Text style={styles.HText}>{i18n.LastName}</Text>
                      <CommonTextInput
                        Value={LastName.trim()}
                        onChange={t => setLastName(t)}
                        PlaceHolder={i18n.LPlaceHolder}
                      />
                    </View>
                  )}
                  {isNext && !isChangePassword && (
                    <View>
                      <Text style={styles.HText}>{i18n.EnterPhone}</Text>
                      <CommonTextInput
                        Value={MobileNumber.trim()}
                        onChange={t => setMobileNumber(t)}
                        PlaceHolder={i18n.PhonePlaceHolder}
                        keyboardType={'number-pad'}
                      />
                      <Text style={styles.HText}>{i18n.EmailAddress}</Text>
                      <CommonTextInput
                        Value={Email.trim()}
                        onChange={t => setEmail(t)}
                        PlaceHolder={i18n.EmailPlaceHolder}
                      />
                      {TypeOfEmp?.registerAdPVOrBs != 'private' && (
                        <>
                          <Text style={styles.HText}>{i18n.CompanyName}</Text>
                          <CommonTextInput
                            Value={CompanyName}
                            onChange={t => setCompanyName(t)}
                            PlaceHolder={i18n.CompanyName}
                          />
                        </>
                      )}
                      <Text style={styles.HText}>{i18n.FullAddress}</Text>
                      <View>
                        <CommonTextInput
                          handleFocus={handleFocus}
                          PlaceHolder={'Search Address'}
                          onChange={t => onChangeSearchAddress(t)}
                          Value={FullAddress}
                        />
                        {searchArray.length != 0 &&
                          searchArray.map((item, index) => {
                            return (
                              <View
                                style={[
                                  {
                                    marginHorizontal: 10,
                                    marginVertical: 4,
                                  },
                                ]}>
                                <TouchableOpacity
                                  style={{
                                    paddingVertical: 4,
                                    justifyContent: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'gray',
                                  }}
                                  onPress={() => {
                                    setFullAddress(item?.description);
                                    setSearchArray([]);
                                  }}>
                                  <Text
                                    style={{
                                      color: colors.colorBlack,
                                      fontSize: 16,
                                    }}>
                                    {item?.description}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        {searchArray.length != 0 && (
                          <View style={{marginBottom: 20}} />
                        )}
                      </View>
                    </View>
                  )}
                  {isChangePassword && (
                    <View>
                      <View>
                        <Text style={[styles.HText]}>{i18n.EnterPassword}</Text>
                      </View>
                      <CommonTextInput
                        PlaceHolder={'*****'}
                        Value={newPassword.trim()}
                        secureTextEntry={true}
                        onChange={t => setNewPassword(t)}
                      />
                      <View>
                        <Text style={[styles.HText]}>
                          {i18n.ConfirmNewPassword}
                        </Text>
                      </View>
                      <CommonTextInput
                        PlaceHolder={'*****'}
                        Value={CnewPassword.trim()}
                        secureTextEntry={true}
                        onChange={t => setCNewPassword(t)}
                      />

                      <View style={styles.TndCView}>
                        <TouchableOpacity
                          style={styles.Box}
                          onPress={() => {
                            setConformTrd(!isConformTrd);
                          }}>
                          {isConformTrd && (
                            <Image
                              source={images.Check}
                              style={styles.CheckImage}
                            />
                          )}
                        </TouchableOpacity>
                        <Text style={styles.Accept}>{i18n.Accept}</Text>
                        <Text style={styles.TD} onPress={() => onPressTRD()}>
                          {i18n.TermsConditions}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
                <View style={styles.M3}>
                  <CommonButton
                    Title={i18n.Next}
                    OnPress={() => onNextPress()}
                    isDisable={returnDisableValue()}
                  />
                </View>
                <View>
                  <CommonButton
                    Title={i18n.GoBack}
                    OnPress={() => onGoBack()}
                  />
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>

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
  M1: {
    marginTop: moderateVerticalScale(20),
  },
  M2: {
    marginTop: moderateVerticalScale(60),
  },
  M3: {
    marginTop: moderateVerticalScale(40),
  },
  HText: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: colors.colorBlack,
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
    marginLeft: moderateScale(8),
    alignSelf: 'center',
  },
  TD: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.colorRed,
    marginLeft: moderateScale(4),
    alignSelf: 'center',
  },
  CheckImage: {
    height: verticalScale(12),
    width: verticalScale(16),
  },
});

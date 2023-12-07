import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  PermissionsAndroid,
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
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../../Components/CommanButton';
import CommonTextInput from '../../../Components/CommanTextInput';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import ImagePicker from 'react-native-image-crop-picker';

import {
  AccountNumberValidation,
  AccountTypeValidation,
  AlternateFullNameValidation,
  AlternetPhoneNumeberValidation,
  BankNameValidation,
  EmailValidation,
  FirstNameValidation,
  GenderTitleValidation,
  HolderValidation,
  IdNumberValidation,
  LastNameValidation,
  PhoneNumberValidation,
  PhysicalAddressValidation,
  ProfileImageValidation,
  UIFValidation,
} from '../../../Comman/validation';
import {
  AlertBox,
  netWorkCheck,
  onSearchAddress,
} from '../../../Comman/constant';
import images from '../../../themes/images';
import CommanLoader from '../../../Components/CommanLoader';
import {Post_Api, Post_Form_Data_Api} from '../../../ApiConsult/ApiHelper';
import {
  EMPLOYEE_VERIFY_API,
  EMPLOYER_ADD_NEW_EMPLOYEE,
  EMPLOYER_LOGIN,
  LOGO_ADD,
  UIF_NUMBERCALLED,
} from '../../../Apis/Api';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAddEmployJson,
  setAddProfile,
} from '../../../ReduxConfig/Slice/TypeofEmploy';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import JobTitle from '../JobDetailsOfTitle.js/JobTitle';
import {userOfData} from '../../../ReduxConfig/Slice/UserDataSlice';
import axios from 'axios';

export default function AddNewEmploye() {
  const dispatch = useDispatch();

  //GETBANK
  const Banks = useSelector(userOfData);
  console.log('Banks user : ', Banks?.payload?.UserData?.data?.email);
  const BankArray = Banks?.payload?.UserData?.Banks?.map((item, index) => {
    return {title: item};
  });
  const Account_Array = Banks?.payload?.UserData?.Account_Type?.map(
    (item, index) => {
      return {title: item};
    },
  );

  //REF
  const scrollViewRef = useRef(null);
  const viewRef = useRef(null);

  //handleFocus
  const handleFocus = () => {
    viewRef.current.measure((x, y) => {
      scrollViewRef.current.scrollTo({x: 0, y: y * 5.5});
    });
  };

  //STATE OF ADD EMPLOYEE
  const [Title, setTitle] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [IdNumber, setIdNumber] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');
  const [PhysicalAddress, setPhysicalAddress] = useState('');
  const [Email, setEmail] = useState('');
  const [bankName, setBankName] = useState('');
  const [HolderName, setHolderName] = useState('');
  const [AccountNumber, setAccountNumber] = useState('');
  const [AccountType, setAccountType] = useState('');
  const [UIFNumber, setUIFNumber] = useState('');
  const [EmployeePicture, setEmployeePicture] = useState('');
  const [FullName, setFullName] = useState('');
  const [AlternetPhoneNumeber, setAlternetPhoneNumeber] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [nickName, setNickName] = useState('');

  //ALLSTATE_CLEAR
  const AllStateClear = () => {
    setTitle('');
    setFirstName('');
    setLastName('');
    setIdNumber('');
    setMobileNumber('');
    setPhysicalAddress('');
    setEmail('');
    setBankName('');
    setHolderName('');
    setAccountNumber('');
    setAccountType('');
    setUIFNumber('');
    setEmployeePicture('');
    setFullName('');
    setAlternetPhoneNumeber('');
    setIsLoader('');
    setNickName('');
    setPhysicalAddress('');
    setBankName('');
    setHolderName('');
  };

  //IMAGE OPTIONS
  const options = {
    saveToPhotos: true,
    mediaType: 'mixed',
    includeExtra: true,
    presentationStyle: 'fullScreen',
  };

  //onNextButton
  const onNextButton = () => {
    const TitleValidation = GenderTitleValidation(Title);
    const FirstValidation = FirstNameValidation(FirstName);
    const LastValidation = LastNameValidation(LastName);
    const IdValidation = IdNumberValidation(IdNumber);
    const MValidation = PhoneNumberValidation(MobileNumber);
    const PhysicalValidation = PhysicalAddressValidation(PhysicalAddress);
    const Email_validation = EmailValidation(Email);
    const BankName_validation = BankNameValidation(bankName);
    const HolderNameValidation = HolderValidation(HolderName);
    const AccountNumber_validation = AccountNumberValidation(AccountNumber);
    const AccountType_validation = AccountTypeValidation(AccountType);
    const UIS_Validation = UIFValidation(UIFNumber);
    const Image_validation = ProfileImageValidation(EmployeePicture);
    const A_fullname_validation = AlternateFullNameValidation(FullName);
    const A_phone_validatoin =
      AlternetPhoneNumeberValidation(AlternetPhoneNumeber);

    if (
      TitleValidation ||
      FirstValidation ||
      LastValidation ||
      IdValidation ||
      MValidation ||
      PhysicalValidation ||
      // Email_validation ||
      // BankName_validation ||
      // HolderNameValidation ||
      // AccountNumber_validation ||
      // AccountType_validation ||
      // UIS_Validation ||
      // Image_validation ||
      A_fullname_validation ||
      A_phone_validatoin
    ) {
      AlertBox({
        Title: i18n.Alert,
        Message:
          TitleValidation ||
          FirstValidation ||
          LastValidation ||
          IdValidation ||
          MValidation ||
          PhysicalValidation ||
          // Email_validation ||
          // BankName_validation ||
          // HolderNameValidation ||
          // AccountNumber_validation ||
          // AccountType_validation ||
          // UIS_Validation ||
          // Image_validation ||
          A_fullname_validation ||
          A_phone_validatoin,
      });
    } else {
      VerifyTheData();
    }
  };

  //VerifyTheData
  const VerifyTheData = async () => {
    setIsLoader(true);

    const PASS_ARRAY = {
      id_number: IdNumber,
      email: Email,
      account_number: AccountNumber,
      holder_name: HolderName,
    };
    console.log('====================================');
    console.log('CHECK EMAIL : ', PASS_ARRAY);
    console.log('====================================');
    const isNet = await netWorkCheck();
    if (isNet) {
      Post_Api(EMPLOYEE_VERIFY_API, PASS_ARRAY)
        .then(value => {
          console.log('====================================');
          console.log(value);
          console.log('====================================');
          // NavigationService.navigate(ScreenName.JobDetailsTitle);
          setIsLoader(false);
          if (value?.data) {
            letsAddNewEmployee();
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

  console.log('MMMM : ', EmployeePicture);

  //letsAddNewEmployee
  const letsAddNewEmployee = async () => {
    setIsLoader(true);
    const PASS_ARRAY = {
      title: Title.trim(),
      first_name: FirstName.trim(),
      last_name: LastName.trim(),
      id_number: IdNumber.trim(),
      mobile_number: MobileNumber.trim(),
      email: Email.trim(),
      address: PhysicalAddress.trim(),
      contact_person_name: FullName.trim(),
      contact_person_number: AlternetPhoneNumeber.trim(),
      bank_name: bankName.trim(),
      holder_name: HolderName.trim(),
      account_number: AccountNumber.trim(),
      account_type: AccountType.trim(),
      UIF_reference_number: UIFNumber.trim(),
      nick_name: nickName,
    };
    // dispatch(setAddEmployJson(PASS_ARRAY));
    // dispatch(setAddProfile(EmployeePicture));
    // NavigationService.navigate(ScreenName.JobDetailsTitle);
    const Params = {
      email: Banks?.payload?.UserData?.data?.email,
    };
    const isNet = await netWorkCheck();
    if (isNet) {
      if (!UIFNumber) {
        Post_Api(UIF_NUMBERCALLED, Params)
          .then(value => {
            dispatch(setAddEmployJson(PASS_ARRAY));
            EmployeePicture != '' && dispatch(setAddProfile(EmployeePicture));
            NavigationService.navigate(ScreenName.JobDetailsTitle);
            setIsLoader(false);
            AllStateClear();
          })
          .catch(error => {
            setIsLoader(false);
            console.log(error);
          });
      } else {
        setIsLoader(false);
        dispatch(setAddEmployJson(PASS_ARRAY));
        dispatch(setAddProfile(EmployeePicture));
        NavigationService.navigate(ScreenName.JobDetailsTitle);
        AllStateClear();
      }
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //onImageUpload
  const onImageUpload = async () => {
    AlertBox({
      Title: 'Upload Photo.',
      ButtonTitle: 'Gallery',
      isCancelAvailable: true,
      CancelTitle: 'Camera',
      Message: 'Please Upload And Click Your Profile Image.',
      onOkPress: () => {
        ImagePicker.openPicker({
          cropping: true,
        }).then(image => {
          console.log('IMAGE ::::: ', image);
          setEmployeePicture(image);
        });
      },
      onCancelPress: () => {
        ImagePicker.openCamera({
          cropping: true,
        }).then(image => {
          console.log('IMAGE ::::: ', image);
          setEmployeePicture(image);
        });
      },
    });
  };

  const letsCheckAPI = id => {
    const formdata = new FormData();
    const newImageUri =
      'file:///' + EmployeePicture.path.split('file:/').join('');
    formdata.append('employee_id', id);
    formdata.append('logo', {
      uri: newImageUri,
      type: EmployeePicture.mime,
      name: newImageUri.split('/').pop(),
    });

    console.log('formdata::: ', formdata);

    setIsLoader(true);
    Post_Form_Data_Api(LOGO_ADD, formdata)
      .then(value => {
        console.log('Value :: ', value);
        setIsLoader(false);
        if (value?.data) {
          AlertBox({
            Title: i18n.Alert,
            Message: value?.message,
            onOkPress: () => {
              NavigationService.navigate(ScreenName.JobDetailsTitle, {
                employee_id: id,
              });
            },
          });
        }
      })
      .catch(error => {
        setIsLoader(false);
        console.log(error);
      });
  };

  //onSearchAddress
  const [searchArray, setSearchArray] = useState([]);
  const onChangeSearchAddress = async t => {
    setPhysicalAddress(t);
    let data = await onSearchAddress(t);
    setSearchArray(data);
    console.log(data);
  };

  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container} ref={viewRef}>
            <CommonLogo />
            <View style={styles.M1}>
              <Text style={styles.HText}>{i18n.AddNewEmploye}</Text>
              <Text style={styles.H2Text}>{i18n.EmployeeDetails}</Text>
            </View>
            <KeyboardAvoidingView
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
              enabled
              keyboardVerticalOffset={
                Platform.OS == 'ios' ? verticalScale(150) : verticalScale(-300)
              }
              >
              <TouchableWithoutFeedback>
                <ScrollView
                  ref={scrollViewRef}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps={'handled'}
                  style={{marginBottom: 10}}
                  bounces={false}
                  >
                  <View style={styles.M1} />
                  <Text style={styles.FullName}>{'Title'}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.TitlePlaceHolder}
                    onChange={t => setTitle(t)}
                    Value={Title.trim()}
                  />
                  <Text style={styles.FullName}>{'First Name'}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.FPlaceHolder}
                    onChange={t => setFirstName(t)}
                    Value={FirstName}
                  />
                  <Text style={styles.FullName}>{'Last Name'}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.LPlaceHolder}
                    onChange={t => setLastName(t)}
                    Value={LastName}
                  />
                  <Text style={styles.FullName}>{'Employee Nick Name'}</Text>
                  <CommonTextInput
                    PlaceHolder={'Enter Nick Name.'}
                    onChange={t => setNickName(t)}
                    Value={nickName}
                  />
                  <Text style={styles.FullName}>{i18n.EmployeeIdNumber}</Text>
                  <CommonTextInput
                    PlaceHolder={''}
                    onChange={t => setIdNumber(t)}
                    Value={IdNumber}
                  />
                  <Text style={styles.FullName}>
                    {i18n.EmployeeMobileNumber}
                  </Text>
                  <CommonTextInput
                    PlaceHolder={i18n.PhonePlaceHolder}
                    keyboardType={'number-pad'}
                    onChange={t => setMobileNumber(t)}
                    Value={MobileNumber}
                  />
                  <Text style={styles.FullName}>{i18n.EmployeeAddress}</Text>
                  {/* <CommonTextInput
                    PlaceHolder={i18n.AddressPlaceHolder}
                    onChange={t => setPhysicalAddress(t)}
                    Value={PhysicalAddress}
                  /> */}
                  <View>
                    <CommonTextInput
                      handleFocus={handleFocus}
                      PlaceHolder={'Search Address'}
                      onChange={t => onChangeSearchAddress(t)}
                      Value={PhysicalAddress}
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
                                setPhysicalAddress(item?.description);
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
                  <Text style={styles.FullName}>{i18n.EmployeeEmail}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.EmailPlaceHolder}
                    onChange={t => setEmail(t)}
                    Value={Email}
                  />
                  <Text style={styles.FullName}>{i18n.EmployeeBank}</Text>
                  {/* <CommonTextInput
                    PlaceHolder={'Eg. FNB'}
                    onChange={t => setBankName(t)}
                    Value={bankName}
                  /> */}
                  <JobTitle
                    Title={'Select'}
                    ArrayOfTitle={BankArray}
                    onTitleSelect={t => setBankName(t)}
                  />
                  <Text style={styles.FullName}>{i18n.BankAccountName}</Text>
                  <CommonTextInput onChange={t => setHolderName(t)} />
                  <Text style={styles.FullName}>{i18n.AccountNumber}</Text>
                  <CommonTextInput
                    keyboardType={'number-pad'}
                    onChange={t => setAccountNumber(t)}
                    Value={AccountNumber}
                  />
                  <Text style={styles.FullName}>{i18n.AccountType}</Text>
                  {/* <CommonTextInput
                    onChange={t => setAccountType(t)}
                    Value={AccountType}
                  /> */}
                  <JobTitle
                    Title={'Select'}
                    ArrayOfTitle={Account_Array}
                    onTitleSelect={t => setAccountType(t)}
                  />
                  <Text style={styles.FullName}>{i18n.UIF}</Text>
                  <CommonTextInput
                    onChange={t => setUIFNumber(t)}
                    Value={UIFNumber}
                  />
                  <Text style={styles.FullName}>{i18n.Picture}</Text>
                  <View style={styles.PictureView}>
                    <TouchableOpacity
                      style={styles.V1}
                      onPress={() => onImageUpload()}>
                      <Image
                        style={{
                          height: verticalScale(20),
                          width: verticalScale(20),
                        }}
                        source={images.Add}
                      />
                      {EmployeePicture == '' ? (
                        <Text>{'Upload'}</Text>
                      ) : (
                        <Text>{'Edit'}</Text>
                      )}
                    </TouchableOpacity>
                    {EmployeePicture && EmployeePicture?.path ? (
                      <View style={styles.V1}>
                        <Image
                          source={{uri: EmployeePicture?.path}}
                          style={{
                            height: verticalScale(80),
                            width: verticalScale(100),
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.colorGray,
                          }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.removeImage}
                          onPress={() => setEmployeePicture('')}>
                          <Image
                            source={images.Cross}
                            style={{
                              height: verticalScale(24),
                              width: verticalScale(24),
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.V1}>
                        <Image
                          source={{
                            uri: 'https://admin.sheshalaw.co.za/public/img/logo.jpg',
                          }}
                          loadingIndicatorSource={
                            <ActivityIndicator
                              size={'small'}
                              style={{alignSelf: 'center'}}
                            />
                          }
                          style={{
                            height: verticalScale(80),
                            width: verticalScale(100),
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.colorGray,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                    )}
                  </View>
                  <Text style={styles.FullName}>
                    {'Alternate Emergency Contact Name & Number'}
                  </Text>
                  <CommonTextInput
                    PlaceHolder={i18n.FullNamePlaceHoler}
                    onChange={t => setFullName(t)}
                    Value={FullName}
                  />
                  <CommonTextInput
                    PlaceHolder={i18n.PhonePlaceHolder}
                    Value={AlternetPhoneNumeber}
                    keyboardType={'number-pad'}
                    onChange={t => setAlternetPhoneNumeber(t)}
                  />
                  <View style={styles.M2} />
                  <CommonButton
                    Title={i18n.Next}
                    OnPress={() => onNextButton()}
                  />
                  <View style={{marginBottom: 100}}>
                    <CommonButton
                      Title={i18n.GoBack}
                      OnPress={() => NavigationService.goBack()}
                    />
                  </View>
                </ScrollView>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

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
  FullName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    marginLeft: moderateVerticalScale(10),
  },
  HText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(10),
    color: colors.colorBlack,
  },
  H2Text: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    alignSelf: 'center',
    color: colors.colorBlack,
  },
  M1: {
    marginTop: moderateVerticalScale(40),
  },
  M2: {
    marginTop: moderateVerticalScale(20),
  },
  PictureView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  V1: {
    height: verticalScale(80),
    width: verticalScale(100),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(8),
    borderRadius: 8,
    backgroundColor: colors.colorWhite,
    borderColor: colors.colorGray,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImage: {
    height: verticalScale(24),
    width: verticalScale(24),
    position: 'absolute',
    right: -10,
    top: -10,
  },
});

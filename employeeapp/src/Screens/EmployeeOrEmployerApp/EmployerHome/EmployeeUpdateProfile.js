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
import React, {useRef, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  AlertBox,
  netWorkCheck,
  onSearchAddress,
} from '../../../Comman/constant';
import {Post_Api, Post_Form_Data_Api} from '../../../ApiConsult/ApiHelper';
import NavigationService from '../../../Navigation/NavigationService';
import i18n from '../../../themes/i18n';
import CommonScreen from '../../../Components/CommanScreen';
import {colors} from '../../../themes';
import CommonLogo from '../../../Components/CommanLogo';
import CommonTextInput from '../../../Components/CommanTextInput';
import CommonButton from '../../../Components/CommanButton';
import CommanLoader from '../../../Components/CommanLoader';
import ImagePicker from 'react-native-image-crop-picker';
import {
  EMPLOYEE_PROFILE_IMAGE_UPDATE,
  EMPLOYEE_PROFILE_UPDATE,
  EMPLOYER_PROFILE_UPDATE,
  LOGO_ADD,
} from '../../../Apis/Api';

export default function EmployeeUpdateProfile(props) {
  //handleFocus
  const handleFocus = () => {
    setOnSearchFocus(true);
  };
  //STATE
  const [FullAddress, setFullAddress] = useState(
    props?.route?.params?.employeeData?.physical_address,
  );
  const [isLoader, setIsLoader] = useState(false);
  const [onSearchFocus, setOnSearchFocus] = useState(false);
  const [EmployeePicture, setEmployeePicture] = useState(undefined);
  const [Email, setEmail] = useState(props?.route?.params?.employeeData?.email);
  const [UIFNumber, setUIFNumber] = useState(
    props?.route?.params?.employeeData?.bank_Details?.UIF_reference_number,
  );
  const [MobileNumber, setMobileNumber] = useState(
    props?.route?.params?.employeeData?.contact_number,
  );

  // /EmployeeUpdateProfile
  const onUpdateProfile = () => {
    const isNet = netWorkCheck();
    const params = {
      employee_id: props?.route?.params?.employeeData?.id,
      uif_reference_number: UIFNumber,
      contact_number: MobileNumber,
      physical_address: FullAddress,
      email: Email,
    };
    console.log('====================================');
    console.log(EmployeePicture);
    console.log('====================================');
    if (isNet) {
      setIsLoader(true);
      Post_Api(EMPLOYEE_PROFILE_UPDATE, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            if (EmployeePicture) {
              letsCheckAPI();
            } else {
              AlertBox({
                Title: i18n.Alert,
                Message: value?.message,
              });
            }
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

  const letsCheckAPI = () => {
    console.log('====================================');
    console.log('letsCheckAPI :: ', EmployeePicture);
    console.log('====================================');
    const formdata = new FormData();
    const employee_id = props?.route?.params?.employeeData?.id;
    const newImageUri =
      'file:///' + EmployeePicture.path.split('file:/').join('');
    formdata.append('employee_id', employee_id);
    formdata.append('logo', {
      uri: newImageUri,
      type: EmployeePicture.mime,
      name: newImageUri.split('/').pop(),
    });
    console.log('formdata::: ', formdata);
    setIsLoader(true);
    Post_Form_Data_Api(EMPLOYEE_PROFILE_IMAGE_UPDATE, formdata)
      .then(value => {
        setIsLoader(false);
        console.log('====================================');
        console.log('value : ', value);
        console.log('====================================');
        if (value?.data) {
          AlertBox({
            Title: i18n.Alert,
            Message: 'Employee Profile update Successfully.',
          });
        }
      })
      .catch(error => {
        setIsLoader(false);
        console.log(error);
      });
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
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <KeyboardAvoidingView
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
              enabled
              keyboardVerticalOffset={
                Platform.OS == 'ios' ? verticalScale(150) : verticalScale(-300)
              }>
              <TouchableWithoutFeedback onPress={() => setOnSearchFocus(false)}>
                <ScrollView
                  style={[
                    styles.M1,
                    {flex: 1},
                    onSearchFocus && {
                      marginBottom:
                        Platform.OS == 'ios' ? verticalScale(50) : 10,
                    },
                  ]}
                  showsVerticalScrollIndicator={false}>
                  <TouchableOpacity
                    style={styles.ImageBox}
                    onPress={() => {
                      onImageUpload();
                    }}>
                    {EmployeePicture ? (
                      <Image
                        source={{
                          uri: EmployeePicture?.path,
                        }}
                        resizeMode="cover"
                        style={{
                          height: verticalScale(100),
                          width: verticalScale(140),
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: colors.colorGray,
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: 'https://admin.sheshalaw.co.za/public/img/logo.jpg',
                        }}
                        resizeMode="cover"
                        style={{
                          height: verticalScale(100),
                          width: verticalScale(140),
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: colors.colorGray,
                        }}></Image>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.FullName}>{i18n.Email}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.Email}
                    Value={Email}
                    onChange={t => setEmail(t)}
                  />
                  <Text style={styles.FullName}>{i18n.UIF}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.UIF}
                    Value={UIFNumber}
                    onChange={t => setUIFNumber(t)}
                  />
                  <Text style={styles.FullName}>{i18n.MobileNumber}</Text>
                  <CommonTextInput
                    PlaceHolder={'0123456789'}
                    onChange={t => setMobileNumber(t)}
                    keyboardType={'number-pad'}
                    Value={MobileNumber}
                    Editable={false}
                  />
                  <Text style={styles.FullName}>{'Full Address'}</Text>
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
                  <CommonButton
                    Title={i18n.UpdateInfo}
                    OnPress={() => onUpdateProfile()}
                  />
                  <CommonButton
                    Title={i18n.GoBack}
                    OnPress={() => NavigationService.goBack()}
                  />
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
  f1: {
    flexDirection: 'row',
  },
  M1: {
    marginTop: moderateVerticalScale(40),
  },
  FullName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    marginLeft: moderateVerticalScale(10),
  },
  LinerStyle: {
    height: verticalScale(100),
  },
  ImageBox: {
    height: verticalScale(100),
    width: verticalScale(140),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.colorGray,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(20),
  },
});

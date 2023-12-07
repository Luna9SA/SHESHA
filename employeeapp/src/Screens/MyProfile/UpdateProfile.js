import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../themes';
import CommonScreen from '../../Components/CommanScreen';
import CommonLogo from '../../Components/CommanLogo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonTextInput from '../../Components/CommanTextInput';
import i18n from '../../themes/i18n';
import CommonButton from '../../Components/CommanButton';
import NavigationService from '../../Navigation/NavigationService';
import {AlertBox, netWorkCheck, onSearchAddress} from '../../Comman/constant';
import {Post_Api} from '../../ApiConsult/ApiHelper';
import {EMPLOYER_PROFILE_UPDATE} from '../../Apis/Api';
import {
  FirstNameValidation,
  FullAddressValidation,
  GenderTitleValidation,
  LastNameValidation,
  PhoneNumberValidation,
} from '../../Comman/validation';
import CommanLoader from '../../Components/CommanLoader';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function UpdateProfile() {
  //STATE
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [MobileNumber, setMobileNumber] = useState('');
  const [FullAddress, setFullAddress] = useState('');
  const [isLoader, setIsLoader] = useState(false);

  // /onUpdateProfile
  const onUpdateProfile = () => {
    const isNet = netWorkCheck();

    const Title_validation = GenderTitleValidation(title);
    const firstname_validation = FirstNameValidation(firstName);
    const last_validation = LastNameValidation(LastName);
    const contact_validation = PhoneNumberValidation(MobileNumber);
    const address_validation = FullAddressValidation(FullAddress);

    if (
      Title_validation ||
      firstname_validation ||
      last_validation ||
      contact_validation ||
      address_validation
    ) {
      AlertBox({
        Title: i18n.Alert,
        Message:
          Title_validation ||
          firstname_validation ||
          last_validation ||
          contact_validation ||
          address_validation,
      });
    } else {
      const params = {
        title: title,
        first_name: firstName,
        last_name: LastName,
        contact_number: MobileNumber,
        address: FullAddress,
      };
      if (isNet) {
        setIsLoader(true);

        Post_Api(EMPLOYER_PROFILE_UPDATE, params)
          .then(value => {
            setIsLoader(false);
            if (value?.data) {
              AlertBox({
                Title: i18n.Alert,
                Message: value?.message,
                onOkPress: () => {
                  NavigationService.goBack();
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
    }
  };

  //onSearchAddress
  const [searchArray, setSearchArray] = useState([]);
  const [onSearchFocus, setOnSearchFocus] = useState(false);

  const onChangeSearchAddress = async t => {
    setFullAddress(t);
    let data = await onSearchAddress(t);
    setSearchArray(data);
    console.log(data);
  };



  //handleFocus
  const handleFocus = () => {
    setOnSearchFocus(true);
  };

  return (
    <CommonScreen
      BackgroundColor={colors.colorRed}
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
                  keyboardShouldPersistTaps={'handled'}
                  bounces={false}
                  showsVerticalScrollIndicator={false}>
                  <Text style={styles.FullName}>{i18n.title}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.TitlePlaceHolder}
                    onChange={t => setTitle(t)}
                  />
                  <Text style={styles.FullName}>{i18n.FirstName}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.FirstName}
                    onChange={t => setFirstName(t)}
                  />
                  <Text style={styles.FullName}>{i18n.LastName}</Text>
                  <CommonTextInput
                    PlaceHolder={i18n.LastName}
                    onChange={t => setLastName(t)}
                  />
                  <Text style={styles.FullName}>{i18n.MobileNumber}</Text>
                  <CommonTextInput
                    PlaceHolder={'0123456789'}
                    onChange={t => setMobileNumber(t)}
                    keyboardType={'number-pad'}
                  />
                  <Text style={styles.FullName}>{i18n.FullAddress}</Text>
                  {/* <CommonTextInput
                PlaceHolder={i18n.Address}
                LinerStyle={styles.LinerStyle}
                onChange={t => setFullAddress(t)}
                MultiLine={true}
              /> */}
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
});

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import CommonMenuLogo from '../../Components/CommanMenuLogo';
import CommonLogo from '../../Components/CommanLogo';
import CommonButton from '../../Components/CommanButton';
import DrawerModal from '../../Components/DrawerModal';
import NavigationService from '../../Navigation/NavigationService';
import i18n from '../../themes/i18n';
import {colors} from '../../themes';
import CommonScreen from '../../Components/CommanScreen';
import {ScreenName} from '../../Navigation/ScreenName';
import {netWorkCheck} from '../../Comman/constant';
import CommanLoader from '../../Components/CommanLoader';
import {EMPLOYER_PROFILE} from '../../Apis/Api';
import {Post_Api} from '../../ApiConsult/ApiHelper';
import {useIsFocused} from '@react-navigation/native';

export default function MyProfileScreen(props) {
  //State
  const [isMenu, setIsMenu] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [ProfileData, setProfileData] = useState(undefined);
  const [isLoader, setIsLoader] = useState(false);

  //FOCUS
  const isFocus = useIsFocused();

  //MEMO PROPS
  useMemo(() => {
    setIsMenu(props?.route?.params?.isMenu);
  }, [props]);

  //UseEffect
  useEffect(() => {
    getProfileData();
  }, [props]);

  //getProfileData
  const getProfileData = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_PROFILE)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            setProfileData(value?.data);
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

  //   /onModalOpen
  const onModalOpen = () => {
    setIsModal(!isModal);
  };

  //onButtonPress
  const onButtonPress = Type => {
    if (Type === i18n.ChangePassword) {
      NavigationService.navigate(ScreenName.ForgotPassword);
    }
    if (Type === i18n.Logout) {
      NavigationService.navigate(ScreenName.LogOut, {color: colors.colorRed});
    }
    if (Type === i18n.EditProfile) {
      NavigationService.navigate(ScreenName.UpdateProfile);
    }
    if (Type == i18n.DeleteAccount) {
      NavigationService.navigate(ScreenName.DeleteAccount);
    }
  };

  //String checker
  const StringCheck = text => {
    if (text) {
      return text;
    } else {
      return '';
    }
  };

  return (
    <CommonScreen
      BackgroundColor={colors.colorRed}
      Container={() => {
        return (
          <View style={styles.Container}>
            {isMenu && (
              <View>
                <CommonMenuLogo onPress={() => onModalOpen()} />
                <CommonLogo isRight />
              </View>
            )}
            {!isMenu && <CommonLogo />}
            {isLoader ? (
              <CommanLoader isVisible={isLoader} />
            ) : (
              <ScrollView
                style={{flex: 1, marginTop: moderateVerticalScale(50)}}
                bounces={false}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.HText}>{i18n.MyProfile}</Text>
                <View style={styles.ProfileView}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TH}>{i18n.title} - </Text>
                    <Text style={styles.TH2}>
                      {StringCheck(ProfileData?.title)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TH}>{i18n.FirstName} - </Text>
                    <Text style={styles.TH2}>
                      {StringCheck(ProfileData?.first_name)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TH}>{i18n.LastName} - </Text>
                    <Text style={styles.TH2}>
                      {StringCheck(ProfileData?.last_name)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TH}>{i18n.MobileNumber} - </Text>
                    <Text style={styles.TH2}>
                      {StringCheck(ProfileData?.contact_number)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TH}>{i18n.Email} - </Text>
                    <Text style={styles.TH2}>
                      {StringCheck(ProfileData?.email)}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TH}>{i18n.Address} - </Text>
                    <Text style={styles.TH2}>
                      {StringCheck(ProfileData?.physical_address)}
                    </Text>
                  </View>
                </View>

                <CommonButton
                  Title={i18n.EditProfile}
                  OnPress={() => onButtonPress(i18n.EditProfile)}
                />
                <CommonButton
                  Title={i18n.ChangePassword}
                  OnPress={() => onButtonPress(i18n.ChangePassword)}
                />
                <CommonButton
                  Title={i18n.Logout}
                  OnPress={() => onButtonPress(i18n.Logout)}
                />
                <CommonButton
                  Title={i18n.DeleteAccount}
                  ViewStyle={styles.ViewStyle}
                  TitleStyle={styles.TitleStyle}
                  OnPress={() => onButtonPress(i18n.DeleteAccount)}
                />
                <CommonButton
                  Title={i18n.GoBack}
                  OnPress={() => NavigationService.goBack()}
                />
              </ScrollView>
            )}

            {isModal && (
              <DrawerModal
                isModalOpen={isModal}
                onCloseButton={() => onModalOpen()}
              />
            )}
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
  HText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(20),
    color: colors.colorBlack,
  },
  TH: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginTop: moderateVerticalScale(10),
    color: colors.colorBlack,
    textAlign: 'right',
    width: '50%',
  },
  TH2: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginTop: moderateVerticalScale(10),
    color: colors.colorBlack,
    textAlign: 'left',
    width : '50%',
  },
  ProfileView: {
    alignSelf: 'center',
    alignItems :'center',
    justifyContent : 'center'
  },
  V1: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  V2: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  ViewStyle: {
    backgroundColor: colors.colorRed,
  },
  TitleStyle: {
    color: colors.colorWhite,
  },
});

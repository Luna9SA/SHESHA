import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import {colors} from '../../../themes';
import i18n from '../../../themes/i18n';
import CommonButton from '../../../Components/CommanButton';
import CommonTextInput from '../../../Components/CommanTextInput';
import NavigationService from '../../../Navigation/NavigationService';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {EMPLOYEE_DELETE_ACCOUNT} from '../../../Apis/Api';
import {ScreenName} from '../../../Navigation/ScreenName';
import {useDispatch} from 'react-redux';
import {userOfData, userToken} from '../../../ReduxConfig/Slice/UserDataSlice';
import CommanLoader from '../../../Components/CommanLoader';

export default function DeleteAccount() {
  //State
  const [isPassword, setIsPassword] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  //DISPATCH
  const dispatch = useDispatch();

  //DeleteAccount
  const DeleteAccount = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYEE_DELETE_ACCOUNT)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            AlertBox({
              Title: i18n.Alert,
              Message: value?.message,
              onOkPress: () => {
                dispatch(userOfData(''));
                dispatch(userToken(''));
                global.AccessToken = undefined;
                NavigationService.resetAndRedirect(ScreenName.Welcome);
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
      BackgroundColor={colors.colorRed}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <View style={styles.M1}>
              {!isPassword && (
                <View>
                  <Text style={styles.HText}>{i18n.DeleteAccount}</Text>
                  <Text style={styles.H2Text}>{i18n.DeleteAccountSpeech}</Text>
                  <CommonButton
                    Title={i18n.Yes}
                    OnPress={() => {
                      DeleteAccount();
                    }}
                  />
                  <CommonButton
                    Title={i18n.NoGobBack}
                    OnPress={() => NavigationService.goBack()}
                  />
                </View>
              )}
              {isPassword && (
                <View>
                  <Text style={styles.FullName}>{i18n.EnterPassword}</Text>
                  <CommonTextInput
                    PlaceHolder={'******'}
                    secureTextEntry={true}
                  />
                  <Text style={styles.FullName}>{i18n.ConfirmNewPassword}</Text>
                  <CommonTextInput
                    PlaceHolder={'******'}
                    secureTextEntry={true}
                  />
                  <CommonButton Title={i18n.DeleteAccount} />
                </View>
              )}
            </View>
            <CommanLoader isVisible={isLoader}/>
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
    marginTop: moderateVerticalScale(60),
  },
  HText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  H2Text: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: moderateVerticalScale(30),
    marginHorizontal: moderateScale(20),
    marginBottom: moderateVerticalScale(30),
  },
  FullName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    marginLeft: moderateVerticalScale(10),
  },
});

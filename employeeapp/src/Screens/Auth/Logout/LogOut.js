import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {EMPLOYER_LOGOUT} from '../../../Apis/Api';
import {useDispatch} from 'react-redux';
import {ScreenName} from '../../../Navigation/ScreenName';
import CommanLoader from '../../../Components/CommanLoader';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import messaging from '@react-native-firebase/messaging';

import {
  userOfData,
  userToken,
  whoLogin,
} from '../../../ReduxConfig/Slice/UserDataSlice';

export default function LogOut(props) {
  //DISPATCH
  const dispatch = useDispatch();

  //State
  const [Color, setColor] = useState(colors.yellow);
  const [isLoader, setIsLoader] = useState(false);

  //propsMemo
  useMemo(() => {
    setColor(props?.route?.params?.color);
  }, [props]);

  //onLogOut
  const onLogOut = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_LOGOUT, '')
        .then(value => {
          setIsLoader(false);
          if (value?.message) {
            AlertBox({
              Title: i18n.Alert,
              Message: 'Logout Successful.',
              onOkPress: () => {
                dispatch(userOfData(undefined));
                dispatch(userToken(undefined));
                dispatch(whoLogin(undefined));
                global.AccessToken = undefined;
                messaging().deleteToken();
                NavigationService.resetAndRedirect(ScreenName.Welcome);
              },
            });
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

  return (
    <CommonScreen
      BackgroundColor={Color}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <CommanLoader isVisible={isLoader} />
            <View style={styles.Container1}>
              <Text style={styles.HText}>{i18n.hLogOut}</Text>
              <Text style={styles.NText}>{i18n.AskLogoUt}</Text>
              <Text style={styles.NText}>{i18n.AreYouSure}</Text>
              <CommonButton Title={i18n.Yes} OnPress={() => onLogOut()} />
              <CommonButton
                Title={i18n.NoGobBack}
                OnPress={() => NavigationService.goBack()}
              />
            </View>
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
  Container1: {
    flex: 1,
    justifyContent: 'center',
  },
  HText: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(30),
    color : colors.colorBlack,
  },
  NText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: moderateScale(30),
    color : colors.colorBlack,
  },
});

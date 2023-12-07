import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import NavigationService from '../../Navigation/NavigationService';
import {ScreenName} from '../../Navigation/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {whoLogin, userToken} from '../../ReduxConfig/Slice/UserDataSlice';
import i18n from '../../themes/i18n';
import {selectTerminatedType} from '../../ReduxConfig/Slice/TypeofEmploy';
import {colors} from '../../themes';
import images from '../../themes/images';

export default function SplashScreen({navigation}) {
  //Token State
  const dispatch = useDispatch();
  const StateToken = useSelector(userToken);
  const StateWhoLogin = useSelector(whoLogin);
  const Token = StateToken?.payload?.UserData?.token;
  const who_login = StateWhoLogin?.payload?.UserData?.Who_login;

  console.log('StateToken ::::: ', Token);
  console.log('who_login ::::: ', who_login);

  //ADD FIRST COMP
  useEffect(() => {
    setGlobalToken();
    NavigationService.setTopLevelNavigator(navigation);
    setTimeout(() => {
      if (who_login == i18n.Employer) {
        dispatch(selectTerminatedType('')),
          NavigationService.resetAndRedirect(ScreenName.EmployerHome);
      } else if (who_login == i18n.Employee) {
        NavigationService.resetAndRedirect(ScreenName.EmployHome);
      } else {
        NavigationService.resetAndRedirect(ScreenName.Welcome);
      }
    }, 2000);
  }, []);

  //setGlobalToken
  const setGlobalToken = () => {
    global.AccessToken = Token;
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.colorWhite}}>
      <Image
        source={images.Splash}
        style={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

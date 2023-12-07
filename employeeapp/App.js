import React, {useEffect} from 'react';
import ScreenNavi from './src/Navigation/ScreenNavi';
import {LogBox} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  LogBox.ignoreAllLogs();
  useEffect(() => {
    setAllMessagingConfig();
  }, []);

  //setAllMessagingConfig
  const setAllMessagingConfig = async () => {
    //GetToken
    requestUserPermission();

    //MESSAING
    messaging().onMessage(message => {
      console.log('onMessage :::: ', message);
    });

    messaging().setBackgroundMessageHandler(message => {
      console.log('setBackgroundMessageHandler :::: ', message);
    });

    messaging().onNotificationOpenedApp(message => {
      console.log('onNotificationOpenedApp :::: ', message);
    });
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    }
  };

  //getToken
  const getToken = async () => {
    const Token = await messaging().getToken();
    AsyncStorage.setItem('fcmtoken', Token);
    console.log('TOKEN :::', Token);
  };

  return <ScreenNavi />;
};

export default App;

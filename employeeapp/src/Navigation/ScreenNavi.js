import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ScreenNavigation from './ScreenNavigation';
import {Provider} from 'react-redux';
import Store from '../ReduxConfig/store/Store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
let persister = persistStore(Store);
export default function ScreenNavi() {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persister}>
        <NavigationContainer>
          <ScreenNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WebView} from 'react-native-webview';
import CommonButton from '../../Components/CommanButton';
import i18n from '../../themes/i18n';
import NavigationService from '../../Navigation/NavigationService';
import {colors} from '../../themes';

export default function Webview(props) {
  console.log('FORM A B ');
  return (
    <View style={{flex: 1 , backgroundColor : 'white'}}>
      <WebView
        source={{uri: props?.route?.params?.url}}
        style={{flex: 1}}
        renderLoading={() => (
          <ActivityIndicator
            size={'large'}
            color={colors.colorBlack}
            style={{alignSelf: 'center'}}
          />
        )}
      />
      <View style={{marginHorizontal : 10}}>
      <CommonButton
        Title={i18n.Back}
        OnPress={() => NavigationService.goBack()}
      />
      </View>
   
    </View>
  );
}

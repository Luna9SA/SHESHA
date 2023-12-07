import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Pdf from 'react-native-pdf';
import CommonButton from '../../../Components/CommanButton';
import i18n from '../../../themes/i18n';
import NavigationService from '../../../Navigation/NavigationService';
import CommanLoader from '../../../Components/CommanLoader';
import { colors } from '../../../themes';

export default function PdfViewer(props) {
  console.log('====================================');
  console.log('props?.route?.params?.isPDF', props?.route?.params?.url);
  console.log('====================================');

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
      <View style={styles.container}>
        {props?.route?.params?.isPDF ? (
          <Pdf
            source={{uri : props?.route?.params?.url}}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`Current page: ${page}`);
            }}
            
            onError={error => {
              console.log(error);
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        ) : (
          <View style={styles.pdf}>
            <Image
              source={{uri: props?.route?.params?.url}}
              style={styles.pdf}
              resizeMode="cover"
              loadingIndicatorSource={<ActivityIndicator size={'large'} />}
            />
          </View>
        )}

      </View>
      <CommonButton
        Title={i18n.GoBack}
        OnPress={() => {
          NavigationService.goBack();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    // flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor : colors.colorWhite
  },
});

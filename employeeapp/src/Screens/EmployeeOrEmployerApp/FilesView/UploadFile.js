import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {colors} from '../../../themes';
import i18n from '../../../themes/i18n';
import images from '../../../themes/images';

export default function UploadFile() {
  return (
    <View style={styles.Container}>
      <Text style={styles.UText}>{i18n.UploadNewDocument}</Text>
      <Image
        source={images.Add}
        style={{height: 20, width: 20, tintColor: colors.colorGray}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    height: verticalScale(36),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(10),
    borderColor: colors.colorGray,
    marginBottom: moderateScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(10),
  },
  UText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.colorGray,
    letterSpacing: 0.5,
  },
  PlusesText: {
    fontSize: moderateScale(30),
    fontWeight: '600',
    color: colors.colorGray,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

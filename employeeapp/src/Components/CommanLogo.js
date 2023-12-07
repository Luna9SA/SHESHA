import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import images from '../themes/images';
import {
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../themes';
import Images from '../themes/images';

export default function CommonLogo({isRight}) {
  return (
    <View style={[styles.Container, isRight && styles.isRightStyle]}>
      <Image
        source={images.SheshLogo}
        style={styles.LogoStyle}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  LogoStyle: {
    height: verticalScale(42),
    width: verticalScale(66),
    alignSelf : 'center'
  },
  Container: {
    height: verticalScale(42),
    width: verticalScale(66),
    // height: verticalScale(42),
    // width: verticalScale(70),
    // backgroundColor: colors.colorWhite,
    borderRadius: 6,
    position: 'absolute',
    alignSelf: 'center',
    top: -Dimensions.get('window').height / 32,
    elevation: 20,
    shadowColor: colors.blackShade,
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.7,
    shadowRadius: 4,
    // borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  isRightStyle: {
    height: verticalScale(42),
    width: verticalScale(66),
    // height: verticalScale(42),
    // width: verticalScale(70),
    // backgroundColor: colors.colorWhite,
    borderRadius: 6,
    position: 'absolute',
    alignSelf: 'center',
    top: -Dimensions.get('window').height / 32,
    right: 6,
    elevation: 20,
    shadowColor: colors.blackShade,
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.7,
    // shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

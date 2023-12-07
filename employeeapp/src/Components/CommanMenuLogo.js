import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import images from '../themes/images';
import {
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../themes';
import Images from '../themes/images';

export default function CommonMenuLogo({onPress}) {
  return (
    <View style={[styles.Container]}>
      <TouchableOpacity onPress={() => onPress && onPress()}>
        <Images.Menu />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  LogoStyle: {
    height: verticalScale(32),
    width: verticalScale(120),
    alignSelf: 'center',
  },
  Container: {
    position: 'absolute',
    alignSelf: 'center',
    top: -30,
    left: 30,
    elevation: 20,
    shadowColor: colors.blackShade,
    shadowOffset: {height: 3, width: 0},
    shadowOpacity: 0.7,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius : 25
  },
});

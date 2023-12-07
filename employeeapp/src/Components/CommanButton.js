import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../themes';
import i18n from '../themes/i18n';
import {moderateScale, verticalScale} from 'react-native-size-matters';

export default function CommonButton({
  Title,
  TitleStyle,
  LinerStyle,
  ViewStyle,
  OnPress,
  isDisable,
}) {
  return (
    <TouchableOpacity onPress={() => OnPress && OnPress()} disabled={isDisable}>
      <LinearGradient
        colors={[
          '#000000',
          '#FEB81C',
          '#F1B41E',
          '#D1AC23',
          '#9C9F2D',
          '#538C3A',
          '#007749',
          '#1B6F46',
          '#6F593D',
          '#AC4937',
          '#D13F33',
          '#E03C32',
          '#001389',
        ]}
        start={{x: 0.0, y: 1.0}}
        end={{x: 1.0, y: 1.0}}
        style={[styles.gradient, LinerStyle]}>
        <View style={[styles.buttonContainer, ViewStyle , isDisable&&{backgroundColor : colors.lightGray}]}>
          <Text style={[styles.buttonText, TitleStyle]}>{Title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: verticalScale(40),
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    margin: moderateScale(10),
  },
  buttonContainer: {
    flex: 1.0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    width: '98%',
    margin: moderateScale(2),
    borderRadius: moderateScale(6),
  },
  buttonText: {
    textAlign: 'center',
    color: colors.colorBlack,
    alignSelf: 'center',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
});

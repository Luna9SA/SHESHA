import React, {Component, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../themes';
import i18n from '../themes/i18n';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import images from '../themes/images';

export default function CommonTextInput({
  PlaceHolder,
  TitleStyle,
  LinerStyle,
  ViewStyle,
  Value,
  onChange,
  keyboardType,
  secureTextEntry,
  Otp,
  MultiLine,
  returnType,
  currentFocus,
  ref,
  Editable,
  handleFocus,
}) {
  const [isSecure, setSecure] = useState(false);
  return (
    <View>
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
        <TextInput
          onFocus={handleFocus ? handleFocus : null}
          style={[
            styles.buttonContainer,
            ViewStyle,
            Otp && {textAlign: 'center'},
            Editable == false && {backgroundColor : colors.lightGray},
            Platform.OS == 'android' && {padding: 0},
          ]}
          placeholder={PlaceHolder}
          placeholderTextColor={colors.colorGray}
          value={Value}
          returnKeyType={returnType}
          onChange={t => onChange && onChange(t?.nativeEvent?.text)}
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          multiline={MultiLine}
          editable={Editable}
          // ref={ref}
          // onSubmitEditing={() => currentFocus.current.focus()}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={{
              height: verticalScale(30),
              width: verticalScale(30),
              position: 'absolute',
              right: 10,
            }}
            onPress={() => setSecure(!isSecure)}>
            {isSecure && (
              <Image source={images.hide} style={{height: 30, width: 30}} />
            )}
            {!isSecure && (
              <Image source={images.view} style={{height: 30, width: 30}} />
            )}
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
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
    paddingHorizontal: verticalScale(10),
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.colorBlack,
  },
});

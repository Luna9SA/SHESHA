import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../themes';
import images from '../themes/images';
import {
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';

export default function CommonScreen({BackgroundColor, Container}) {
  const [isKeyBordOpen, setStateKeybordOpen] = useState(false);
  const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
    setStateKeybordOpen(true);
  });
  const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
    setStateKeybordOpen(false);
  });
  return (
    <SafeAreaView style={styles.Container}>
      <View style={styles.Container}>
        <View style={[styles.ImageStyle, {backgroundColor: BackgroundColor}]}>
          <Image
            source={images.TopLines}
            style={styles.LinesImage}
            resizeMode="cover"
          />
        </View>
        {Container && Container()}
        {!isKeyBordOpen && (
          <View
            style={[
              styles.ImageStyle,
              {
                backgroundColor: BackgroundColor,
                height: verticalScale(80),
                // marginBottom: moderateVerticalScale(10),
              },
            ]}>
            <Image
              source={images.BottomLines}
              style={styles.LinesImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.colorWhite,
  },
  ImageStyle: {
    height: verticalScale(80),
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  LinesImage: {
    height: verticalScale(80),
    width: '100%',
  },
});

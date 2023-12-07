import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Images from '../../../themes/images';
import { colors } from '../../../themes';

export default function FilesView({Title}) {
  return (
    <View style={styles.Container}>
      <LinearGradient
        style={styles.TopLiner}
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
      />
      <View style={styles.MiddleView}>
        <Text style={styles.HText}>{Title}</Text>
        <TouchableOpacity>
          <Images.Option />
        </TouchableOpacity>
      </View>
      <LinearGradient
        style={styles.TopLiner}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    height: verticalScale(44),
    backgroundColor: 'pink',
    justifyContent: 'space-between',
  },
  TopLiner: {
    height: verticalScale(2),
  },
  MiddleView: {
    flex: 1.0,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color : colors.colorBlack
  },
});

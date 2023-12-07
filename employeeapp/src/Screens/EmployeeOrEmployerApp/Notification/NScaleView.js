import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import LeaveView from '../DayLeaves/LeaveView';
import i18n from '../../../themes/i18n';

export default function NScaleView({isNew, description, Title}) {
  return (
    <View style={styles.Container}>
      <LeaveView Title={Title} />
      <Text style={styles.DText}>{description}</Text>
      {isNew == 0 && (
        <View style={styles.NewView}>
          <Text style={styles.NewText}>{'New'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    // height: verticalScale(90),
    borderWidth: moderateScale(1.5),
    borderColor: colors.colorGray,
    borderRadius: 10,
    padding: moderateScale(10),
    marginTop: moderateVerticalScale(10),
  },
  DText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: colors.colorGray,
    marginTop: moderateScale(10),
  },
  NewView: {
    position: 'absolute',
    right: 40,
    height: verticalScale(18),
    width: verticalScale(34),
    backgroundColor: colors.colorRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  NewText: {
    fontSize: moderateScale(10),
    fontWeight: '500',
    color: colors.colorBlack,
  },
});

import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import {colors} from '../../../themes';
import i18n from '../../../themes/i18n';
import CommonButton from '../../../Components/CommanButton';
import CommonTextInput from '../../../Components/CommanTextInput';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';

export default function Termination(props) {
  const Name =
    props?.route?.params?.item?.first_name +
    ' ' +
    props?.route?.params?.item?.last_name;
  const employee_id = props?.route?.params?.employee_id;
  return (
    <CommonScreen
      BackgroundColor={colors.colorBlack}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <View style={styles.M1}>
              <Text style={styles.HText}>{i18n.TerminationCapital}</Text>
              <Text
                style={
                  styles.H2Text
                }>{`You are about to start the process of termination for (${Name}).`}</Text>
              <Text style={styles.H2Text}>{i18n.DoYouWant}</Text>
              <CommonButton
                Title={i18n.Yes}
                OnPress={() =>
                  NavigationService.navigate(ScreenName.ReasonsTermination, {
                    item: props?.route?.params?.item,
                    employee_id : employee_id,
                  })
                }
              />
              <CommonButton
                Title={i18n.GoBack}
                OnPress={() => NavigationService.goBack()}
              />
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: moderateScale(10),
    backgroundColor: colors.colorWhite,
  },
  M1: {
    marginTop: moderateVerticalScale(60),
  },
  HText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  H2Text: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: moderateVerticalScale(30),
    marginHorizontal: moderateScale(20),
    marginBottom: moderateVerticalScale(30),
  },
  FullName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    marginLeft: moderateVerticalScale(10),
  },
});

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import CommonScreen from '../../../Components/CommanScreen';
import images from '../../../themes/images';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import i18n from '../../../themes/i18n';
import {useDispatch, useSelector} from 'react-redux';
import {selectEmployType, setRegisterAdPVOrBs} from '../../../ReduxConfig/Slice/TypeofEmploy';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';

export default function ChooseLoginType() {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  //DiSPATCH
  const dispatch = useDispatch();

  //State
  const [isEmployerRegisterSelect, setIsEmployerRegisterSelect] =
    useState(false);

  //onButtonPress
  const onButtonPress = Type => {
    if (Type === i18n.Login) {
      NavigationService.navigate(ScreenName.LoginScreen);
    }
    if (Type === i18n.FLogin) {
      NavigationService.navigate(ScreenName.ForgotPassword, i18n.FLogin);
      // NavigationService.navigate(ScreenName.TermsAndCondition);
      
    }
    if (Type === i18n.Register) {
      employerRegisterSelect();
    }
    if (Type === i18n.GoBack) {
      if (isEmployerRegisterSelect) {
        setIsEmployerRegisterSelect(false);
      } else {
        NavigationService.goBack();
      }
    }
  };

  //employerRegisterSelect
  const employerRegisterSelect = () => {
    setIsEmployerRegisterSelect(true);
  };
  return (
    <CommonScreen
      BackgroundColor={
        typeOfEmployState == i18n.Employer ? colors.colorRed : colors.yellow
      }
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {!isEmployerRegisterSelect && (
                <>
                  <View style={styles.M1}>
                    <CommonButton
                      LinerStyle={styles.gradient}
                      Title={
                        typeOfEmployState == i18n.Employer
                          ? i18n.Register
                          : i18n.Login
                      }
                      OnPress={() =>
                        onButtonPress(
                          typeOfEmployState == i18n.Employer
                            ? i18n.Register
                            : i18n.Login,
                        )
                      }
                    />
                  </View>
                  <View style={styles.M2}>
                    <CommonButton
                      LinerStyle={styles.gradient}
                      Title={
                        typeOfEmployState == i18n.Employer
                          ? i18n.Login
                          : i18n.FLogin
                      }
                      OnPress={() =>
                        onButtonPress(
                          typeOfEmployState == i18n.Employer
                            ? i18n.Login
                            : i18n.FLogin,
                        )
                      }
                    />
                  </View>
                </>
              )}
              {isEmployerRegisterSelect && (
                <>
                  <View style={styles.M1}>
                    <CommonButton
                      LinerStyle={styles.gradient}
                      Title={'Private Employer'}
                      OnPress={() => {
                        dispatch(setRegisterAdPVOrBs(i18n.privet))
                        NavigationService.navigate(ScreenName.RegisterScreen);
                      }}
                    />
                  </View>
                  <View style={styles.M2}>
                    <CommonButton
                      LinerStyle={styles.gradient}
                      Title={'Business Employer'}
                      OnPress={() => {
                        dispatch(setRegisterAdPVOrBs(i18n.business))
                        NavigationService.navigate(ScreenName.RegisterScreen);
                      }}
                    />
                  </View>
                </>
              )}

              <View style={styles.M3}>
                <CommonButton
                  Title={i18n.GoBack}
                  OnPress={() => onButtonPress(i18n.GoBack)}
                />
              </View>
            </ScrollView>
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
  gradient: {
    height: verticalScale(140),
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
  },
  M1: {
    marginTop: moderateVerticalScale(40),
  },
  M2: {
    marginTop: moderateVerticalScale(10),
  },
  M3: {
    marginTop: moderateVerticalScale(60),
  },
});

import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CommonScreen from '../../Components/CommanScreen';
import images from '../../themes/images';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import {colors} from '../../themes';
import CommonLogo from '../../Components/CommanLogo';
import i18n from '../../themes/i18n';
import CommonButton from '../../Components/CommanButton';
import NavigationService from '../../Navigation/NavigationService';
import {ScreenName} from '../../Navigation/ScreenName';
import {useDispatch} from 'react-redux';
import {selectEmployType} from '../../ReduxConfig/Slice/TypeofEmploy';

export default function ChooseEmployee() {
  //ReduxStates
  const dispatch = useDispatch();

  //onEmployerPress
  const onEmployerPress = Type => {
    dispatch(selectEmployType(Type));
    NavigationService.navigate(ScreenName.ChooseLoginType);
  };

  return (
    <CommonScreen
    BackgroundColor={colors.colorBlack}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <Text style={styles.ChooseText}>{i18n.AreYouIn}</Text>
              <CommonButton
                LinerStyle={styles.gradient}
                Title={i18n.Employer}
                OnPress={() => onEmployerPress(i18n.Employer)}
              />
              <Text style={styles.ChooseText}>{i18n.OrAn}</Text>
              <CommonButton
                LinerStyle={styles.gradient}
                Title={i18n.Employee}
                OnPress={() => onEmployerPress(i18n.Employee)}
              />
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
  ChooseText: {
    alignSelf: 'center',
    marginTop: moderateScale(30),
    fontSize: moderateScale(15),
    fontWeight: '800',
    color : colors.colorBlack
  },
  gradient: {
    height: verticalScale(140),
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    margin: moderateScale(20),
  },
});

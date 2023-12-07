import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
import Images from '../../../themes/images';
import {AlertBox} from '../../../Comman/constant';

const ArrayOfReason = [
  {
    id: 1,
    name: i18n.SummaryDismissal,
  },
  {
    id: 2,
    name: i18n.Resignation,
  },
  {
    id: 3,
    name: i18n.ContractEnded,
  },
  {
    id: 4,
    name: i18n.Desertion,
  },
  {
    id: 5,
    name: i18n.IIIhealth,
  },
  {
    id: 6,
    name: i18n.PooWork,
  },
  {
    id : 7,
    name : 'Retired',
  }
];

export default function ReasonsTermination(props) {
  //STATE
  const [ResoneArray, setResoneArray] = useState(ArrayOfReason);
  const [SelectedR, setSelected] = useState(undefined);

  //showReasonsItems
  const showReasonsItems = (item, index) => {
    return (
      <TouchableOpacity
        style={[
          styles.RView,
          // index % 2 !== 0 && {backgroundColor: colors.lightGray},
          item?.name == SelectedR && {borderColor: colors.colorRed, borderWidth : 1.5},
        ]}
        key={index || item?.id}
        onPress={() => setSelected(item?.name)}>
        <Text style={styles.HText}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <CommonScreen
      BackgroundColor={colors.colorBlack}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <View style={[styles.f1, styles.M1]}>
              <Text style={styles.HMainText}>{i18n.ReasonForTerminate}</Text>
              <View style={styles.M2}>
                <FlatList
                  data={ResoneArray}
                  keyExtractor={(item, index) => index}
                  renderItem={({item, index}) => showReasonsItems(item, index)}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                />
              </View>
            </View>
            <View style={styles.M3} />
            <CommonButton
              Title={i18n.Next}
              OnPress={() => {
                if (SelectedR) {
                  NavigationService.navigate(ScreenName.TerminatoinDoc, {
                    reason: SelectedR,
                    item: props?.route?.params?.item,
                    employee_id : props?.route?.params?.employee_id,
                  });
                } else {
                  AlertBox({
                    Title: i18n.Alert,
                    Message:
                      'Please Select Any Reason For Termination Employee.',
                  });
                }
              }}
            />
            <CommonButton
              Title={i18n.Back}
              OnPress={() => NavigationService.goBack()}
            />
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
  f1: {
    flex: 1,
  },
  M1: {
    marginTop: moderateVerticalScale(50),
  },
  M2: {
    marginTop: moderateVerticalScale(10),
  },
  M3: {
    marginTop: moderateVerticalScale(20),
  },
  HText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.lightBlack,
    letterSpacing: 0.5,
  },
  HMainText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    alignSelf: 'center',
  },
  RView: {
    height: verticalScale(34),
    borderColor: colors.colorBlack,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateVerticalScale(10),
  },
});

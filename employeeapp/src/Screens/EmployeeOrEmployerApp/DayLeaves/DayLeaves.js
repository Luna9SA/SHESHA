import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import {useSelector} from 'react-redux';
import {selectEmployType} from '../../../ReduxConfig/Slice/TypeofEmploy';
import i18n from '../../../themes/i18n';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import LeaveView from './LeaveView';
import {netWorkCheck} from '../../../Comman/constant';
import {DAY_LEAVES, EMPLOYER_PAYSLIP_LIST} from '../../../Apis/Api';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import CommanLoader from '../../../Components/CommanLoader';
import {useIsFocused} from '@react-navigation/native';
import LeaveViewNew from './LeaveViewNew';

export default function DaysLeave(props) {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  //State
  const [Color, setColor] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [leavArray, setLeaveArray] = useState([]);

  //PropsUseMemo
  useMemo(() => {
    setColor(props?.route?.params?.color);
  }, [props]);

  //onBackPress
  const onBackPress = () => {
    NavigationService.goBack();
  };
  const focus = useIsFocused();
  //UseEffect
  useEffect(() => {
    callDayLeave();
  }, [props]);

  //callDayLeave
  const callDayLeave = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      employee_id: props?.route?.params?.employee_id,
      // employee_id: 32,
    };
    console.log('employer_id : ', params);
    if (isNet) {
      Post_Api(DAY_LEAVES, params)
        .then(value => {
          console.log('value ::: ', value?.data);
          setIsLoader(false);
          if (value?.data) {
            setLeaveArray(value?.data);
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };
  return (
    <CommonScreen
      BackgroundColor={Color}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.DaysLeave}</Text>
            <View style={styles.f1}>
              <View>
                <Text style={styles.HText2}>{'Employee Leave History'}</Text>
                {leavArray.length != 0 && (
                  <FlatList
                    data={leavArray}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    renderItem={({item, index}) => {
                      return (
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              color: colors.colorBlack,
                              marginTop: 10,
                              marginBottom : 6
                            }}>
                            {item?.month}
                          </Text>
                          <LeaveViewNew
                            Array={item?.data}
                            onPress={t => {
                              NavigationService.navigate(
                                ScreenName.ViewOrEditLeave,
                                {
                                  item: t,
                                  employee_id:
                                    props?.route?.params?.employee_id,
                                  UserType:
                                    typeOfEmployState == i18n.Employer
                                      ? true
                                      : false,
                                },
                              );
                            }}
                          />
                        </View>
                      );
                    }}
                  />
                )}
              </View>
              {!isLoader && leavArray.length == 0 && (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={styles.HText2}>{'No Leave Found.'}</Text>
                </View>
              )}
            </View>
            <CommonButton Title={i18n.Back} OnPress={() => onBackPress()} />
            <CommanLoader isVisible={isLoader} />
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
    padding: moderateScale(4),
  },
  M1: {
    marginTop: moderateVerticalScale(20),
  },
  HText: {
    marginTop: moderateVerticalScale(40),
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(30),
    color: colors.colorBlack,
  },
  HText2: {
    fontSize: moderateScale(12),
    fontWeight: '400',
    color: colors.colorGray,
    marginBottom: moderateScale(8),
    color: colors.colorBlack,
  },
});

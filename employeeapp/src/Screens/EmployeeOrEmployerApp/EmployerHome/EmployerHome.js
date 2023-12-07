import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import CommonMenuLogo from '../../../Components/CommanMenuLogo';
import i18n from '../../../themes/i18n';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import DrawerModal from '../../../Components/DrawerModal';
import {useDispatch, useSelector} from 'react-redux';
import {selectTerminatedType} from '../../../ReduxConfig/Slice/TypeofEmploy';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {
  EMPLOYER_EMPLOYEE_LIST,
  EMPLOYER_TERMINATED_LIST,
} from '../../../Apis/Api';
import CommanLoader from '../../../Components/CommanLoader';
import {FlatList} from 'react-native';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

export default function EmployerHome() {
  //ReduxState
  const dispatch = useDispatch();
  const isFocus = useIsFocused();
  const TerminateState = useSelector(selectTerminatedType);
  const Terminated = TerminateState?.payload?.TypeOfEmp?.Terminated;

  //State
  const [isLoader, setIsLoader] = useState(false);
  const [EmployeeList, setEmployeeList] = useState(undefined);

  //onEmoryPress
  const onEmoryPress = item => {
    NavigationService.navigate(ScreenName.EmployerProfile, {
      color:
        Terminated === i18n.TerminatedEmploy ? colors.colorRed : colors.yellow,
      employee_id: item?.id,
    });
  };

  //State
  const [isModal, setIsModal] = useState(false);

  //onModalOpen
  const onModalOpen = () => {
    setIsModal(!isModal);
  };

  //onAddNewButton
  const onAddNewButton = () => {
    NavigationService.navigate(ScreenName.AddNewEmployee);
  };

  //getEmployeeList
  const getEmployeeList = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_EMPLOYEE_LIST)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            setEmployeeList(value?.data);
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

  useEffect(() => {
    setIsLoader(true);
    setEmployeeList(undefined);
    if (Terminated === i18n.TerminatedEmploy) {
      getTerminatedEmployeeList();
    } else {
      getEmployeeList();
    }
  }, [Terminated || isFocus]);

  //getTerminatedEmployeeList
  const getTerminatedEmployeeList = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_TERMINATED_LIST)
        .then(value => {
          setIsLoader(false);
          console.log(value);
          if (value?.data) {
            setEmployeeList(value?.data);
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
      BackgroundColor={colors.colorRed}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonMenuLogo onPress={() => onModalOpen()} />
            <CommonLogo isRight />
            <View style={styles.Container2}>
              {Terminated === i18n.TerminatedEmploy && (
                <View>
                  <Text style={styles.HText}>{i18n.TerminatedEmploy}</Text>
                </View>
              )}
              {Terminated !== i18n.TerminatedEmploy && (
                <View>
                  <Text style={styles.HText}>{i18n.YourEmployerName}</Text>
                  <CommonButton
                    LinerStyle={styles.ButtonStyle}
                    Title={i18n.AddNew}
                    OnPress={() => onAddNewButton()}
                  />
                </View>
              )}
              {EmployeeList && EmployeeList.length > 0 ? (
                <FlatList
                  data={EmployeeList}
                  keyExtractor={(item, index) => index}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={[
                          styles.EmployeesBox,
                          index % 2 != 0 && {
                            backgroundColor: colors.lightGray,
                          },
                        ]}
                        onPress={() => onEmoryPress(item)}>
                        <Text style={styles.EmployeeName}>
                          {item?.first_name + ' ' + item?.last_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {!isLoader && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.colorBlack,
                        fontWeight: 'bold',
                      }}>
                      No Data Found.
                    </Text>
                  )}
                </View>
              )}
            </View>
            {Terminated === i18n.TerminatedEmploy && (
              <CommonButton
                Title={i18n.Back}
                OnPress={() => dispatch(selectTerminatedType(''))}
              />
            )}
            {isModal && (
              <DrawerModal
                isModalOpen={isModal}
                onCloseButton={() => onModalOpen()}
              />
            )}
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
  Container2: {
    flex: 1,
    marginTop: moderateVerticalScale(70),
  },
  HText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(10),
    color : colors.colorBlack
  },
  ButtonStyle: {
    height: verticalScale(34),
  },
  EmployeesBox: {
    height: verticalScale(50),
    borderWidth: moderateScale(2),
    borderColor: colors.colorGray,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateVerticalScale(10),
  },
  EmployeeName: {
    fontSize: moderateScale(14),
    color: colors.colorBlack,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

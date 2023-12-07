import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import i18n from '../../../themes/i18n';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import CommanLoader from '../../../Components/CommanLoader';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import CommonTextInput from '../../../Components/CommanTextInput';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {
  ADD_LEAVE,
  EDIT_LEAVE,
  EMPLOYER_TERMINATED_LIST,
  GET_ALL_LEAVE_TYPES,
} from '../../../Apis/Api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import JobTitle from '../JobDetailsOfTitle.js/JobTitle';
import {ScreenName} from '../../../Navigation/ScreenName';
import {selectTerminatedType} from '../../../ReduxConfig/Slice/TypeofEmploy';
import { useSelector } from 'react-redux';

//LeaveArray
const LeaveArray = [
  {
    title: 'Paid',
  },
  {
    title: 'Unpaid',
  },
];

export default function EditLeave(props) {
  const [isLoader, setIsLoader] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [isToModalOpen2, setIsToModalOpen2] = useState(false);
  const [isToDate, setToDate] = useState(new Date());
  const [isToDate2, setToDate2] = useState(new Date());
  const [propsStartDate, setPropsStartDate] = useState(
    props?.route?.params?.item?.start_date,
  );
  const [propsEndDate, setPropsEndDate] = useState(
    props?.route?.params?.item?.end_date,
  );
  const [LeaveType, setLeaveType] = useState(
    props?.route?.params?.item?.leave_type,
  );
  const [leavArray, setLeaveArray] = useState([]);
  const [Reason, setReson] = useState(props?.route?.params?.item?.reason);

  const TerminateState = useSelector(selectTerminatedType);
  const Terminated = TerminateState?.payload?.TypeOfEmp?.Terminated;

  useEffect(() => {
    console.log('====================================');
    console.log(props?.route?.params);
    console.log('====================================');
    getAllLeaveTypes();
  }, [props]);
  //getAllLeaveTypes
  const getAllLeaveTypes = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(GET_ALL_LEAVE_TYPES, '')
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            setLeaveArray(
              value?.data?.map((item, index) => {
                return {
                  title: item?.leave_type,
                };
              }),
            );
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

  //onBackPress
  const onBackPress = () => {
    NavigationService.goBack();
  };
  //ConvertTime
  const convertTime = time => {
    const TIME = moment(time).format('YYYY-MM-DD');
    return TIME;
  };

  //onAddLeave
  const onAddLeave = async () => {
    const isNet = await netWorkCheck();
    if (LeaveType == '') {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select Leave Type.(paid/unpaid)',
      });
    } else if (Reason == '') {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select Leave Reason.',
      });
    } else {
      if (isNet) {
        setIsLoader(true);
        const params = {
          employee_id: props?.route?.params?.employee_id,
          leave_id: props?.route?.params?.item?.id,
          start_date: propsStartDate ? propsStartDate : convertTime(isToDate),
          end_date: propsEndDate ? propsEndDate : convertTime(isToDate2),
          leave_type: LeaveType,
          reason: Reason,
        };
        console.log('param :: ', params);
        Post_Api(EDIT_LEAVE, params)
          .then(value => {
            setIsLoader(false);
            console.log(value);
            if (value?.data) {
              AlertBox({
                Title: i18n.Alert,
                Message: 'Leave Edit Successfully.',
                onOkPress: () => {
                  NavigationService.navigate(ScreenName.DaysLeave, {
                    employee_id: props?.route?.params?.employee_id,
                    color:
                      Terminated === i18n.TerminatedEmploy
                        ? colors.colorRed
                        : colors.green1,
                  });
                },
              });
            }
          })
          .catch(error => {
            setIsLoader(false);
          });
      } else {
        setIsLoader(false);
        AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
      }
    }
  };
  return (
    <CommonScreen
      BackgroundColor={colors.green1}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{'Edit Leave'}</Text>
            <KeyboardAwareScrollView>
              <View style={styles.f1}>
                <View>
                  <Text
                    style={[styles.HText2, {marginTop: 10, marginBottom: 0}]}>
                    {'Leave Type?'}
                  </Text>
                  <JobTitle
                    ArrayOfTitle={leavArray}
                    Title={Reason}
                    onTitleSelect={t => setReson(t)}
                  />
                  <Text style={styles.HText2}>
                    {'Select Your Leave  Dates'}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={styles.TimeView}
                      onPress={() => {
                        setIsToModalOpen(true);
                      }}>
                      <Text>
                        {propsStartDate
                          ? propsStartDate
                          : convertTime(isToDate)}
                      </Text>
                    </TouchableOpacity>
                    <Text>To</Text>
                    <TouchableOpacity
                      style={styles.TimeView}
                      onPress={() => {
                        setIsToModalOpen2(true);
                      }}>
                      <Text>
                        {propsEndDate ? propsEndDate : convertTime(isToDate2)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[styles.HText2, {marginTop: 10, marginBottom: 0}]}>
                    {'Paid Or Unpaid Leave?'}
                  </Text>
                  <JobTitle
                    ArrayOfTitle={LeaveArray}
                    Title={LeaveType}
                    onTitleSelect={t => setLeaveType(t)}
                  />
                </View>
                <View style={{height: 20}} />
                <CommonButton Title={'SAVE'} OnPress={() => onAddLeave()} />
                <CommonButton Title={i18n.Back} OnPress={() => onBackPress()} />
              </View>
            </KeyboardAwareScrollView>

            <CommanLoader isVisible={isLoader} />
            <DatePicker
              modal
              open={isToModalOpen}
              date={isToDate}
              mode={'date'}
              onConfirm={date => {
                setIsToModalOpen(false);
                setPropsStartDate(undefined);
                setToDate(date);
              }}
              onCancel={() => {
                setIsToModalOpen(false);
              }}
            />
            <DatePicker
              modal
              open={isToModalOpen2}
              date={isToDate2}
              mode={'date'}
              onConfirm={date => {
                setIsToModalOpen2(false);
                setPropsEndDate(undefined);
                setToDate2(date);
              }}
              onCancel={() => {
                setIsToModalOpen2(false);
              }}
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
  TimeView: {
    height: verticalScale(40),
    width: verticalScale(100),
    borderColor: colors.colorGray,
    borderRadius: moderateScale(8),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FTText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: moderateVerticalScale(6),
    color: colors.colorBlack,
    alignSelf: 'center',
    marginBottom: moderateVerticalScale(4),
  },
});

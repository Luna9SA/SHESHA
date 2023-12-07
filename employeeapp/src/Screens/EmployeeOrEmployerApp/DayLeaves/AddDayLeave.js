import {
  FlatList,
  Keyboard,
  Linking,
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
import {ADD_LEAVE, EMPLOYER_TERMINATED_LIST} from '../../../Apis/Api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import JobTitle from '../JobDetailsOfTitle.js/JobTitle';
import {ScreenName} from '../../../Navigation/ScreenName';

//LeaveArray
const LeaveArray = [
  {
    title: 'Paid',
  },
  {
    title: 'Unpaid',
  },
];

export default function AddDayLeave(props) {
  const [isLoader, setIsLoader] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [isToModalOpen2, setIsToModalOpen2] = useState(false);
  const [isToDate, setToDate] = useState(new Date());
  const [isToDate2, setToDate2] = useState(new Date());
  const [LeaveType, setLeaveType] = useState('');
  const [isKeybordOpen, setIsKeyBordOpen] = useState(false);
  const [Reason, setReson] = useState('');

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
    } else {
      if (isNet) {
        setIsLoader(true);
        const params = {
          employee_id: props?.route?.params?.employeeData?.id,
          start_date: convertTime(isToDate),
          end_date: convertTime(isToDate2),
          leave_type: LeaveType,
          reason: props?.route?.params?.leaveType?.leave_type,
        };
        console.log('param :: ', params);
        Post_Api(ADD_LEAVE, params)
          .then(value => {
            setIsLoader(false);
            console.log(value);
            if (value?.data) {
              AlertBox({
                Title: i18n.Alert,
                Message: 'Leave Added Successfully.',
                onOkPress: () => {
                  NavigationService.goBack();
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

  const removeSpaceInDescription = description => {
    return description.replace(/\s+/g, ' ');
  };

  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>
              {props?.route?.params?.leaveType?.leave_type}
            </Text>
            <View style={{marginBottom: 10, flexDirection: 'row'}}>
              <Text style={styles.HText1}>
                {removeSpaceInDescription(
                  props?.route?.params?.leaveType?.description,
                )}
                <Text
                  style={styles.ClickText}
                  onPress={() => {
                    // Linking.openURL( props?.route?.params?.leaveType?.leave_link)
                    NavigationService.navigate(ScreenName.Webview, {
                      url: props?.route?.params?.leaveType?.leave_link,
                    });
                  }}>
                  {' '}
                  CLICK HERE
                </Text>
              </Text>
            </View>
            <KeyboardAwareScrollView>
              <View style={styles.f1}>
                <View>
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
                      <Text>{convertTime(isToDate)}</Text>
                    </TouchableOpacity>
                    <Text>To</Text>
                    <TouchableOpacity
                      style={styles.TimeView}
                      onPress={() => {
                        setIsToModalOpen2(true);
                      }}>
                      <Text>{convertTime(isToDate2)}</Text>
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={[styles.HText2, {marginTop: 10, marginBottom: 0}]}>
                    {'Paid Or Unpaid Leave?'}
                  </Text>
                  <JobTitle
                    ArrayOfTitle={LeaveArray}
                    Title={'Select leave type'}
                    onTitleSelect={t => setLeaveType(t)}
                  />
                </View>
                <View style={{height: 20}} />
                <CommonButton
                  Title={'ADD LEAVE'}
                  OnPress={() => onAddLeave()}
                />
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
    marginBottom: moderateScale(10),
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
  HText1: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.colorGray,
    alignSelf: 'center',
    textAlign: 'auto',
  },
  ClickText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.colorRed,
  },
});

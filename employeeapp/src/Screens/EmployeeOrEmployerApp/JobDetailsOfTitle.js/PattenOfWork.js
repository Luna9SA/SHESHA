import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import CommonScreen from '../../../Components/CommanScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CommonTextInput from '../../../Components/CommanTextInput';
import JobTitle from './JobTitle';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import {AlertBox} from '../../../Comman/constant';
import {useSelector} from 'react-redux';

export default function PattenOfWork(props) {
  const [PattenWorkWork, setPattenOfWork] = useState([
    {
      id: 1,
      name: 'Same every week',
    },
    {
      id: 2,
      name: 'No real pattern',
    },
  ]);
  // {
  //   id: 2,
  //   name: 'Only every two weeks',
  // },
  const [Provided, setProvided] = useState([
    {
      id: 1,
      name: 'Breakfast',
      isSelected: false,
    },
    {
      id: 2,
      name: 'Lunch',
      isSelected: false,
    },
    {
      id: 3,
      name: 'Coffee/Tea',
      isSelected: false,
    },
    {
      id: 4,
      name: 'None of the above',
      isSelected: false,
    },
  ]);

  const [Per, setPer] = useState([
    {
      id: 1,
      title: 'Per Day',
    },
    // {
    //   id: 2,
    //   title: 'Per Week',
    // },
    {
      id: 2,
      title: 'Per Month',
    },
  ]);

  const [isFromDate, setIsFromDate] = useState(new Date());
  const [isFromDate1, setIsFromDate1] = useState(new Date());
  const [teaBreak, setTeaBreak] = useState(undefined);
  const [teaBreak1, setTeaBreak1] = useState(undefined);
  const [isLunchTime, setLunchTime] = useState(undefined);
  const [isStartLunchTime, setStartLunchTime] = useState(new Date());
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [pattenwork, setPattenWork] = useState(undefined);
  const [lunchBreakHours, setLunchBreakHours] = useState(undefined);
  const [provided, setProvide] = useState(undefined);
  const [selectPer, setSelectPer] = useState(undefined);
  const [amount, setamount] = useState('');

  const User_State = useSelector(state => state?.UserData?.data?.private);
  console.log('User_State : ', User_State);

  const clearAllData = () => {
    setIsFromDate(new Date());
    setIsFromDate1(new Date());
    setTeaBreak(undefined);
    setTeaBreak1(undefined);
    setLunchTime(undefined);
    setStartLunchTime(new Date());
    setPattenWork(undefined);
    setLunchBreakHours(undefined);
    setSelectPer(undefined);
    setamount(undefined);
  };

  const checkLunchBreak = () => {
    const startShiftTime = moment(isFromDate, 'DD-MM-YYYY hh:mm:ss A');
    const endShiftTime = moment(isToDate, 'DD-MM-YYYY hh:mm:ss A');
    const duration = moment.duration(startShiftTime.diff(endShiftTime));
    const TotalHrs = Math.abs(duration.asHours().toFixed());
    console.log('TOO : ', TotalHrs);
    if (TotalHrs != 1) {
      return true;
    } else {
      return false;
    }
  };

  //onNext
  const onNext = () => {
    var pattern_of_work =
      props?.route?.params?.days_of_work == 'No real pattern'
        ? 'No real pattern'
        : pattenwork;
    var employer_provide = Provided.map(item => {
      console.log('item : ', item);
      return item?.isSelected && item?.name;
    }).toString();
    var rands_amount = amount;
    var per = selectPer;
    // var FlagOfCountHrs = checkLunchBreak();
    console.log(
      'props?.route?.params?.employee_id ::::::: ',
      props?.route?.params?.employee_id,
    );

    if (!pattern_of_work) {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select Pattern Of Work.',
      });
    } else if (!lunchBreakHours) {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please select the lunch break.',
      });
    } else if (!employer_provide) {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select The Your Provided.',
      });
    } else if (!amount || amount == '') {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Add Your Amount.',
      });
    } else if (!selectPer) {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select The Day , Work , Month.',
      });
    }
    // else if (!isLunchTime) {
    //   AlertBox({
    //     Title: i18n.Alert,
    //     Message: 'Please Select Your Lunch Time.',
    //   });
    // }
    else {
      NavigationService.navigate(ScreenName.TermAndCondition, {
        work_from: props?.route?.params?.work_from,
        work_to: props?.route?.params?.work_to,
        days_of_work: props?.route?.params?.days_of_work,
        employment_start_date: props?.route?.params?.employment_start_date,
        job_title: props?.route?.params?.job_title,
        job_duties: props?.route?.params?.job_duties,
        pattern_of_work: pattern_of_work,
        lunch: lunchBreakHours,
        tea_break: teaBreak,
        tea_break_1: teaBreak1,
        start_lunch_break: isStartLunchTime,
        employer_provide: employer_provide,
        rands_amount: rands_amount,
        per: per,
        compnayname: props?.route?.params?.compnayname,
        addNewEmployee: true,
      });
      clearAllData();
    }
  };

  //ConvertTime
  const convertTime = time => {
    const TIME = moment(time).format('HH:mm a');
    return TIME;
  };
  console.log(props?.route?.params?.days_of_work);
  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.AddNewEmploye}</Text>
            <Text style={styles.H2Text}>{i18n.JobDetails}</Text>
            <KeyboardAwareScrollView
              style={styles.Box}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <Text style={styles.HHText}>{i18n.PattenOfWork}</Text>
              <FlatList
                data={PattenWorkWork}
                keyExtractor={(item, index) => index}
                bounces={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          item.name == 'No real pattern' &&
                          props?.route?.params?.days_of_work !=
                            'No real pattern'
                        ) {
                          AlertBox({
                            Title: i18n.Alert,
                            Message:
                              'You are select the days for work so here you can not select no real pattern.',
                          });
                        } else {
                          setPattenWork(item?.name);
                        }
                      }}
                      disabled={
                        props?.route?.params?.days_of_work == 'No real pattern'
                      }
                      style={[
                        styles.SelectTerminate,
                        pattenwork == item?.name && {
                          borderColor: colors.colorRed,
                          borderWidth: 1.5,
                        },
                        props?.route?.params?.days_of_work == item?.name && {
                          borderColor: colors.colorRed,
                          borderWidth: 1.5,
                        },
                      ]}
                      key={index}>
                      <Text style={styles.HText1}>{item?.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />

              <Text
                style={[
                  styles.M2,
                  User_State != 1
                    ? {marginTop: 0}
                    : {
                        textAlign: 'justify',
                        fontSize: moderateScale(14),
                        fontWeight: '400',
                        marginTop: moderateVerticalScale(6),
                        color: colors.colorBlack,
                        alignSelf: 'center',
                      },
                ]}>
                {User_State != 1 ? '' : i18n.BrekSpeech}
              </Text>
              <Text style={[styles.HHText, {marginTop: 10}]}>
                {'Length of lunch break'}
              </Text>
              <FlatList
                data={[{name: '1 HOUR'}, {name: '30 MINUTES'}]}
                keyExtractor={(item, index) => index}
                bounces={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => setLunchBreakHours(item?.name)}
                      style={[
                        styles.SelectTerminate,
                        lunchBreakHours == item?.name && {
                          borderColor: colors.colorRed,
                          borderWidth: 1.5,
                        },
                      ]}
                      key={index}>
                      <Text style={styles.HText1}>{item?.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <Text style={[styles.HHText, {marginTop: 10}]}>
                {'Lunch start time'}
              </Text>
              <TouchableOpacity
                style={[styles.TimeView, {alignSelf: 'center'}]}
                onPress={() => {
                  setIsStartModalOpen(true);
                }}>
                <Text style={{color: colors.colorBlack}}>
                  {isLunchTime
                    ? convertTime(isStartLunchTime)
                    : 'Select your time'}
                </Text>
              </TouchableOpacity>
              <Text style={[styles.HHText, {marginTop: 10}]}>
                {'15 minute tea breaks (Not required)'}
              </Text>
              <View>
                <Text style={styles.FTText}>{'Select your tea time'}</Text>
                <TouchableOpacity
                  style={[styles.TimeView, {alignSelf: 'center'}]}
                  onPress={() => {
                    setIsFromModalOpen(true);
                  }}>
                  <Text style={{color: colors.colorBlack}}>
                    {teaBreak ? convertTime(isFromDate) : 'Select your time'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.TimeView, {alignSelf: 'center', marginTop: 2}]}
                  onPress={() => {
                    setIsToModalOpen(true);
                  }}>
                  <Text style={{color: colors.colorBlack}}>
                    {teaBreak1 ? convertTime(isFromDate1) : 'Select your time'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.M2}>
                <Text style={styles.HHText}>
                  {'The Employer shall provide the employee with'}
                </Text>
              </View>
              <FlatList
                data={Provided}
                keyExtractor={(item, index) => index}
                bounces={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        const newArray = [...Provided];
                        if (item.name == 'None of the above') {
                          newArray[0].isSelected = false;
                          newArray[1].isSelected = false;
                          newArray[2].isSelected = false;
                          newArray[3].isSelected = true;
                          setProvided(newArray);
                        } else {
                          newArray[3].isSelected = false;
                          newArray[index].isSelected =
                            newArray[index].isSelected == true ? false : true;
                          setProvided(newArray);
                        }
                      }}
                      style={[
                        styles.SelectTerminate,
                        item?.isSelected && {
                          borderColor: colors.colorRed,
                          borderWidth: 1.5,
                        },
                      ]}
                      key={index}>
                      <Text style={styles.HText1}>{item?.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <View style={styles.M2}>
                <Text style={styles.HHText}>{i18n.WagesRate}</Text>
                {User_State == 1 && (
                  <Text style={styles.HHText}>
                    {
                      'Current minimum wage: With effect from 1 March 2023 this is R25,42 per hour.'
                    }
                  </Text>
                )}
              </View>
              <CommonTextInput
                PlaceHolder={i18n.randAmount}
                onChange={t => setamount(t)}
                keyboardType={'number-pad'}
              />
              <JobTitle
                Title={i18n.per}
                ArrayOfTitle={Per}
                onTitleSelect={t => setSelectPer(t)}
              />
              <CommonButton Title={i18n.Next} OnPress={() => onNext()} />
              <CommonButton
                Title={i18n.GoBack}
                OnPress={() => NavigationService.goBack()}
              />
            </KeyboardAwareScrollView>
            <DatePicker
              modal
              open={isFromModalOpen}
              date={isFromDate}
              mode={'time'}
              onConfirm={date => {
                setIsFromModalOpen(false);
                setTeaBreak(date);
                setIsFromDate(date);
              }}
              onCancel={() => {
                setIsFromModalOpen(false);
              }}
            />
            <DatePicker
              modal
              open={isToModalOpen}
              date={isFromDate1}
              mode={'time'}
              onConfirm={date => {
                setIsToModalOpen(false);
                setTeaBreak1(date);
                setIsFromDate1(date);
              }}
              onCancel={() => {
                setIsToModalOpen(false);
              }}
            />
            <DatePicker
              modal
              open={isStartModalOpen}
              date={isStartLunchTime}
              mode={'time'}
              onConfirm={date => {
                setIsStartModalOpen(false);
                setStartLunchTime(date);
                setLunchTime(date);
              }}
              onCancel={() => {
                setIsStartModalOpen(false);
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
  M1: {
    marginTop: moderateVerticalScale(20),
  },
  M2: {
    marginTop: moderateVerticalScale(10),
  },
  HHText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: colors.colorBlack,
  },
  HText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: moderateVerticalScale(40),
    color: colors.colorBlack,
    alignSelf: 'center',
  },
  HText1: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.lightBlack,
    letterSpacing: 0.5,
  },
  H2Text: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: moderateVerticalScale(6),
    color: colors.colorBlack,
    alignSelf: 'center',
  },
  Box: {
    flex: 1,
    marginTop: moderateVerticalScale(30),
    paddingHorizontal: moderateVerticalScale(10),
    marginBottom: moderateVerticalScale(10),
  },
  SelectTerminate: {
    height: verticalScale(30),
    borderColor: colors.colorGray,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    marginTop: moderateVerticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  f1: {
    flexDirection: 'row',
    padding: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TimeView: {
    height: verticalScale(40),
    // width: verticalScale(100),
    width: '100%',
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

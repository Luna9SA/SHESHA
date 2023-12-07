import {
  FlatList,
  ScrollView,
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
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {AlertBox} from '../../../Comman/constant';
import {useIsFocused} from '@react-navigation/native';

//WORKING DAYS
const WorkingOfDaysArray = [
  {
    id: 1,
    name: 'Monday',
    isSelected: false,
  },
  {
    id: 2,
    name: 'Tuesday',
    isSelected: false,
  },
  {
    id: 3,
    name: 'Wednesday',
    isSelected: false,
  },
  {
    id: 4,
    name: 'Thursday',
    isSelected: false,
  },
  {
    id: 5,
    name: 'Friday',
    isSelected: false,
  },
  {
    id: 6,
    name: 'Saturday',
    isSelected: false,
  },
  {
    id: 7,
    name: 'Sunday',
    isSelected: false,
  },
  {
    id: 8,
    name: 'No real pattern',
    isSelected: false,
  },
];

export default function WorkDay(props) {
  //State
  const [DaysStates, setDaysStates] = useState([]);
  const [isFromDate, setIsFromDate] = useState(new Date());
  const [isToDate, setToDate] = useState(new Date());
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);

  const focus = useIsFocused();

  useEffect(() => {
    setDaysStates(
      WorkingOfDaysArray.map((item, index) => {
        return {
          id: item.id,
          name: item.name,
          isSelected: false,
        };
      }),
    );
    return () => {
      setToDate(new Date());
      setIsFromDate(new Date());
    };
  }, [props]);
  //Select Days
  const selectMultipleDay = index => {
    var newArray = [...DaysStates];
    console.log(index);
    if (index == 7) {
      newArray[0].isSelected = false;
      newArray[1].isSelected = false;
      newArray[2].isSelected = false;
      newArray[3].isSelected = false;
      newArray[4].isSelected = false;
      newArray[5].isSelected = false;
      newArray[6].isSelected = false;
      newArray[7].isSelected = true;
      setDaysStates(newArray);
    } else {
      newArray[7].isSelected = false;

      newArray[index].isSelected =
        newArray[index].isSelected == false ? true : false;
      setDaysStates(newArray);
    }
  };

  //renderItem
  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.SelectTerminate,
          item?.isSelected && {borderColor: colors.colorRed, borderWidth: 1.5},
        ]}
        onPress={() => selectMultipleDay(index)}>
        <Text style={styles.HText1}>{item?.name}</Text>
      </TouchableOpacity>
    );
  };

  //onNext
  const onNext = () => {
    var DayOfWork = [];
    for (let i = 0; i < DaysStates.length; i++) {
      const element = DaysStates[i];
      if (element?.isSelected) {
        DayOfWork.push(element?.name);
      }
    }
    var days_of_work = DayOfWork.toString();
    if (DayOfWork.length == 0) {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select Your Day Of Work.',
      });
    } else if (convertTime(isFromDate) == convertTime(isToDate)) {
      AlertBox({
        Title: i18n.Alert,
        Message: 'Start Time and End Time Should Not Be Same!',
      });
    } else {
      const WORK_FORM = convertTime(isFromDate);
      const WORK_TO = convertTime(isToDate);

      console.log('WORK_FORM ::', WORK_FORM);
      console.log('WORK_TO ::', WORK_TO);
      NavigationService.navigate(ScreenName.PattenOfWork, {
        work_from: isFromDate,
        work_to: isToDate,
        days_of_work: days_of_work,
        employment_start_date: props?.route?.params?.employment_start_date,
        job_title: props?.route?.params?.job_title,
        job_duties: props?.route?.params?.job_duties,
        compnayname: props?.route?.params?.compnayname,
      });
    }
  };

  //ConvertTime
  const convertTime = time => {
    const TIME = moment(time).format('HH:mm a');
    return TIME;
  };
  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.AddNewEmploye}</Text>
            <Text style={styles.H2Text}>{i18n.JobDetails}</Text>
            <ScrollView
              style={styles.Box}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <Text style={styles.HHText}>{i18n.DayOfWork}</Text>
              <View>
                <FlatList
                  data={DaysStates}
                  keyExtractor={(item, index) => index}
                  showsVerticalScrollIndicator={false}
                  renderItem={({item, index}) => renderItem(item, index)}
                />
              </View>
              <View style={styles.M2}>
                <Text style={styles.HHText}>{i18n.HOfWork}</Text>
              </View>
              <View style={styles.f1}>
                <View>
                  <Text style={styles.FTText}>{i18n.From}</Text>
                  <TouchableOpacity
                    style={styles.TimeView}
                    onPress={() => {
                      setIsFromModalOpen(true);
                    }}>
                    <Text style={{color: colors.colorBlack}}>
                      {convertTime(isFromDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text>{i18n.To}</Text>
                <View>
                  <Text style={styles.FTText}>{i18n.To}</Text>
                  <TouchableOpacity
                    style={styles.TimeView}
                    onPress={() => {
                      setIsToModalOpen(true);
                    }}>
                    <Text style={{color: colors.colorBlack}}>
                      {convertTime(isToDate)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <CommonButton OnPress={() => onNext()} Title={i18n.Next} />
              <CommonButton
                OnPress={() => NavigationService.goBack()}
                Title={i18n.GoBack}
              />
            </ScrollView>
            <DatePicker
              modal
              open={isFromModalOpen}
              date={isFromDate}
              mode={'time'}
              onConfirm={date => {
                setIsFromModalOpen(false);
                setIsFromDate(date);
              }}
              onCancel={() => {
                setIsFromModalOpen(false);
              }}
            />
            <DatePicker
              modal
              open={isToModalOpen}
              date={isToDate}
              mode={'time'}
              onConfirm={date => {
                setIsToModalOpen(false);
                setToDate(date);
              }}
              onCancel={() => {
                setIsToModalOpen(false);
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

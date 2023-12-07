import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import images from '../../../themes/images';
import JobTitle from './JobTitle';
import CommonTextInput from '../../../Components/CommanTextInput';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import {useSelector} from 'react-redux';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {EMPLOYER_DUTIES, EMPLOYER_TITLE} from '../../../Apis/Api';
import {useIsFocused} from '@react-navigation/native';
import CommanLoader from '../../../Components/CommanLoader';
import DatePicker from 'react-native-date-picker';

export default function JobDetailsOfTitle(props) {
  //FOCUS
  const Focus = useIsFocused();
  const User_State = useSelector(state => state?.UserData?.data?.private);
  console.log('User_State : ', User_State);
  const {CompanyName} = useSelector(state => state?.UserData);
  console.log('CompanyName : ', CompanyName);

  //REF
  const scrollViewRef = useRef(null);
  const viewRef = useRef(null);

  //handleFocus
  const handleFocus = () => {
    viewRef.current.measure((x, y) => {
      scrollViewRef.current.scrollTo({x: 0, y: 200});
    });
  };

  //State
  const [isLoader, setIsLoader] = useState(false);
  const [TitleArray, setTitleArray] = useState(undefined);
  const [DutiesArray, setDutiesArray] = useState(undefined);
  const [selectedTitle, setSelectedTitle] = useState(undefined);
  const [isDate, setIsDate] = useState(false);
  const [date, setDate] = useState(new Date());
  const [otherDuties, setOtherDuties] = useState(undefined);
  const [compnayname, setCompnayName] = useState(CompanyName);
  const [isTitleFlag, setIsTitleFlag] = useState(false);

  const clearAllSatate = () => {
    setTitleArray(undefined);
    setDutiesArray(undefined);
    setSelectedTitle(undefined);
    setOtherDuties(undefined);
  };

  //GET TITLE ARRAY
  useEffect(() => {
    getTitleArray();
    console.log('====================================');
    console.log('LOADERRRRRR');
    console.log('====================================');
  }, [Focus]);

  //getTitleArray
  const getTitleArray = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_TITLE, '')
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            setTitleArray(value?.data);
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

  //lest get duties
  useMemo(() => {
    setIsLoader(true);
    if (selectedTitle) {
      const params = {
        title: selectedTitle,
      };
      Post_Api(EMPLOYER_DUTIES, params)
        .then(value => {
          setIsLoader(false);
          console.log('dasbajhc : ', value?.data);
          if (value?.data) {
            setDutiesArray(value?.data);
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    }
    setIsLoader(false);
  }, [selectedTitle]);

  //onNext
  const onNext = () => {
    var employment_start_date =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var job_title = selectedTitle; //we have to add passing by add new
    var job_duties = [];
    var Other = otherDuties;
    if (DutiesArray && DutiesArray.length != 0) {
      for (let i = 0; i < DutiesArray.length; i++) {
        const element = DutiesArray[i];
        if (element?.isDutiesSelect) {
          job_duties.push(element?.duties);
        }
      }
    }

    if (!job_title) {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: 'Please Select Title.'});
    } else if (compnayname == undefined && User_State != 1) {
      setIsLoader(false);
      AlertBox({
        Title: i18n.Alert,
        Message: 'Please Select Your Company Name.',
      });
    } else {
      setIsLoader(false);
      NavigationService.navigate(ScreenName.WorkDay, {
        employment_start_date: employment_start_date,
        job_title: job_title,
        compnayname: compnayname,
        job_duties:
          job_duties.length != 0
            ? job_duties.toString() + ',' + (Other ? Other : '')
            : Other,
      });
      clearAllSatate();
    }
  };

  //onDateSelect
  const onDateSelect = () => {
    setIsDate(!isDate);
  };

  //showDuties
  const showDuties = (item, index) => {
    console.log(item);
    return (
      <TouchableOpacity
        style={[
          styles.JobDuties,
          item?.isDutiesSelect
            ? {borderColor: 'red'}
            : {borderColor: colors.colorGray},
        ]}
        key={index}
        onPress={() => onMultipleSelect(index)}>
        <Text style={styles.HText1}>{item?.duties}</Text>
      </TouchableOpacity>
    );
  };

  //onMultipleSelect
  const onMultipleSelect = index => {
    const newArray = [...DutiesArray];
    newArray[index].isDutiesSelect =
      newArray[index].isDutiesSelect == undefined
        ? true
        : newArray[index].isDutiesSelect == true
        ? false
        : true;
    setDutiesArray(newArray);
  };

  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container} ref={viewRef}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.AddNewEmploye}</Text>
            <Text style={styles.H2Text}>{i18n.JobDetails}</Text>
            <KeyboardAvoidingView
              style={{flex: 1}}
              keyboardShouldPersistTaps={'handled'}
              showsVerticalScrollIndicator={false}
              // style={{flex: 1}}
              behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
              enabled
              keyboardVerticalOffset={Platform.OS == 'ios' ? 120 : -100}>
              <TouchableNativeFeedback>
                <ScrollView
                  style={styles.Box}
                  showsVerticalScrollIndicator={false}
                  ref={scrollViewRef}
                  bounces={false}>
                  <View>
                    <Text style={styles.HHText}>{i18n.StartDate}</Text>
                    <TouchableOpacity
                      style={styles.SelectTerminate}
                      onPress={() => onDateSelect()}>
                      <Text style={styles.HText1}>{i18n.SelectDate}</Text>
                      {/* <Image source={images.DropDown} style={styles.DownImage} /> */}
                    </TouchableOpacity>
                  </View>
                  {date && (
                    <View style={styles.selectDate}>
                      <Text style={styles.HText1}>
                        {date.getDate() +
                          '/' +
                          (date.getMonth() + 1) +
                          '/' +
                          date.getFullYear()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.M1}>
                    <Text style={styles.HHText}>{i18n.JobTitle}</Text>
                  </View>
                  <JobTitle
                    Title={'Select'}
                    ArrayOfTitle={TitleArray}
                    onTitleSelect={t => setSelectedTitle(t)}
                  />
                  <View>
                    {DutiesArray &&
                      DutiesArray.length != 0 &&
                      User_State == 1 && (
                        <View>
                          <Text style={styles.HHText}>{i18n.JobDuties}</Text>
                          <FlatList
                            data={DutiesArray}
                            keyExtractor={(item, index) => index}
                            renderItem={({item, index}) =>
                              showDuties(item, index)
                            }
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                          />
                        </View>
                      )}
                    <View style={styles.M2}>
                      <Text style={[styles.HHText, {textAlign: 'justify'}]}>
                        {User_State == 1
                          ? i18n.Other
                          : 'Duties'}{' (If you are adding multiple job descriptions, please add a comma between each listed duty)'}
                      </Text>
                    </View>

                    <CommonTextInput
                      handleFocus={handleFocus}
                      onChange={t => setOtherDuties(t)}
                      LinerStyle={styles.OtherStyle}
                      Value={otherDuties}
                      MultiLine={true}
                      PlaceHolder={User_State == 1 ? i18n.Other : 'Duties'}
                    />

                    {User_State != 1 && (
                      <>
                        <View style={styles.M2}>
                          <Text style={styles.HHText}>{i18n.CompanyName}</Text>
                        </View>
                        <CommonTextInput
                          onChange={t => setCompnayName(t)}
                          PlaceHolder={i18n.CompanyName}
                          Value={compnayname}
                        />
                      </>
                    )}

                    <CommonButton Title={i18n.Next} OnPress={() => onNext()} />
                    <CommonButton
                      Title={i18n.GoBack}
                      OnPress={() => NavigationService.goBack()}
                    />
                  </View>
                </ScrollView>
              </TouchableNativeFeedback>
            </KeyboardAvoidingView>

            <CommanLoader isVisible={isLoader} />
            <DatePicker
              modal
              open={isDate}
              date={date}
              mode={'date'}
              onConfirm={date => {
                setIsDate(false);
                setDate(date);
              }}
              onCancel={() => {
                setIsDate(false);
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
  HText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: moderateVerticalScale(40),
    color: colors.colorBlack,
    alignSelf: 'center',
  },
  HHText: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: colors.colorBlack,
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
    paddingHorizontal: moderateScale(10),
  },
  SelectTerminate: {
    height: verticalScale(36),
    flexDirection: 'row',
    paddingHorizontal: moderateScale(8),
    borderColor: colors.colorGray,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    marginTop: moderateVerticalScale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  DownImage: {
    height: verticalScale(14),
    width: verticalScale(16),
  },
  selectDate: {
    height: verticalScale(30),
    justifyContent: 'center',
    paddingHorizontal: moderateScale(10),
    borderBottomColor: colors.colorGray,
    borderBottomWidth: 1,
    marginTop: moderateVerticalScale(8),
    marginHorizontal: moderateScale(4),
  },
  JobDuties: {
    // height: verticalScale(30),
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    marginTop: moderateVerticalScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  OtherStyle: {
    height: verticalScale(150),
  },
});

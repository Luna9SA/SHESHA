import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useState} from 'react';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import i18n from '../../../themes/i18n';
import NavigationService from '../../../Navigation/NavigationService';
import CommanLoader from '../../../Components/CommanLoader';
import {Post_Api, Post_Form_Data_Api} from '../../../ApiConsult/ApiHelper';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {ScreenName} from '../../../Navigation/ScreenName';
import {
  EMPLOYEE_DUTIES,
  EMPLOYER_ADD_NEW_EMPLOYEE,
  EMPLOYER_FILES,
  EMPLOYER_PAYSLIP,
  LOGO_ADD,
} from '../../../Apis/Api';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {
  setAddEmployJson,
  setAddProfile,
} from '../../../ReduxConfig/Slice/TypeofEmploy';

export default function TermAndCondition(props) {
  const Employee_Json_Data = useSelector(
    state => state?.TypeOfEmp?.AddEmployJson,
  );
  const Employee_Profile_Image = useSelector(
    state => state?.TypeOfEmp?.AddProfile,
  );

  const dispatch = useDispatch();

  //state
  const [fromAddNewEmployee, setFromAddNewEmployee] = useState(false);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  //props
  useMemo(() => {
    console.log(props?.route?.params);
    setFromAddNewEmployee(props?.route?.params?.addNewEmployee);
  }, [props]);

  //yesAgreeButton
  const yesAgreeButton = () => {
    letsAddEmployee();
    // letsAddJobDetails();
    console.log('====================================');
    console.log('Employee_Profile_Image', Employee_Profile_Image);
    console.log('====================================');
    console.log('countTotalHours : ', countTotalHours());
  };

  //letsAddNewEmployee
  const letsAddEmployee = async () => {
    setIsLoader(true);
    const parmas = {
      title: Employee_Json_Data?.title,
      first_name: Employee_Json_Data?.first_name,
      last_name: Employee_Json_Data?.last_name,
      id_number: Employee_Json_Data?.id_number,
      mobile_number: Employee_Json_Data?.mobile_number,
      email: Employee_Json_Data?.email ? Employee_Json_Data?.email : '',
      address: Employee_Json_Data?.address,
      contact_person_name: Employee_Json_Data?.contact_person_name,
      contact_person_number: Employee_Json_Data?.contact_person_number,
      bank_name: Employee_Json_Data?.bank_name,
      holder_name: Employee_Json_Data?.holder_name,
      account_number: Employee_Json_Data?.account_number,
      account_type: Employee_Json_Data?.account_type,
      UIF_reference_number: Employee_Json_Data?.UIF_reference_number
        ? Employee_Json_Data?.UIF_reference_number
        : '',
      nick_name: Employee_Json_Data?.nick_name,
    };
    console.log('letsAddEmployee : ', parmas);
    const isNet = await netWorkCheck();
    if (isNet) {
      Post_Api(EMPLOYER_ADD_NEW_EMPLOYEE, parmas)
        .then(value => {
          console.log('Value :: ', value);
          setIsLoader(false);
          if (value?.data) {
            console.log('employee_id :::::::: ', value);
            const employee_id = value?.data?.id;
            console.log('employee_id :::::::: ', employee_id);
            if (Employee_Profile_Image) {
              console.log('letsCheckAPI :::::::: ', Employee_Profile_Image);

              letsCheckAPI(employee_id);
            } else {
              letsAddJobDetails(employee_id);
            }
          }
        })
        .catch(error => {
          setIsLoader(false);
          console.log(error);
        });
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  const letsCheckAPI = id => {
    const formdata = new FormData();
    const employee_id = id;
    const newImageUri =
      'file:///' + Employee_Profile_Image.path.split('file:/').join('');
    formdata.append('employee_id', id);
    console.log('newImageUri::: ', newImageUri);
    console.log('Employee_Profile_Image::: ', Employee_Profile_Image.mime);
    console.log('newImageUri::: ', newImageUri.split('/').pop());
    formdata.append('logo', {
      uri: newImageUri,
      type: Employee_Profile_Image.mime,
      name: newImageUri.split('/').pop(),
    });
    console.log('LOGO_ADD::: ', formdata);

    setIsLoader(true);
    Post_Form_Data_Api(LOGO_ADD, formdata)
      .then(value => {
        console.log('LOGO_ADD  DATA :: ', value);
        setIsLoader(false);
        if (value?.data) {
          letsAddJobDetails(employee_id);
        }
      })
      .catch(error => {
        setIsLoader(false);
        console.log(error);
      });
  };

  //ConvertTime
  const convertTime = time => {
    const TIME = moment(time).format('HH:mm a');
    return TIME;
  };

  //letsAddJobDetails
  const letsAddJobDetails = async employee_id => {
    const isNet = await netWorkCheck();
    const Per_State = perSelect(props?.route?.params?.per);
    const params = {
      addNewEmployee: true,
      days_of_work: props?.route?.params?.days_of_work,
      employee_id: employee_id,
      employer_provide: props?.route?.params?.employer_provide,
      employment_start_date: props?.route?.params?.employment_start_date,
      job_duties: props?.route?.params?.job_duties,
      job_title: props?.route?.params?.job_title,
      lunch: props?.route?.params?.lunch,
      tea_break: props?.route?.params?.tea_break
        ? convertTime(props?.route?.params?.tea_break)
        : '',
      tea_break_1: props?.route?.params?.tea_break_1
        ? convertTime(props?.route?.params?.tea_break_1)
        : '',
      start_lunch_break: props?.route?.params?.start_lunch_break,
      pattern_of_work: props?.route?.params?.pattern_of_work,
      per: Per_State,
      rands_amount: props?.route?.params?.rands_amount,
      work_from: convertTime(props?.route?.params?.work_from),
      work_to: convertTime(props?.route?.params?.work_to),
      company_name: props?.route?.params?.compnayname,
      terms_conditions1: 1,
      terms_conditions2: 1,
    };
    console.log('params of Job Duties :::: ', params);

    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYEE_DUTIES, params)
        .then(value => {
          console.log('Employee DUTIES :::: ', value);
          setIsLoader(false);
          if (value?.data) {
            callFileApi(value?.data, employee_id);
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      AlertBox({
        Title: i18n.Alert,
        Message: i18n.InternetConnectivity,
      });
    }
  };

  //letsSetPerDay
  const perSelect = per => {
    var patten;
    if (per == 'Per Day') {
      patten = 'day';
    } else if (per == 'Per Week') {
      patten = 'week';
    } else {
      patten = 'month';
    }
    return patten;
  };

  //callFileApi
  const callFileApi = async (Data, employee_id) => {
    const TotalHrs = countTotalHours();
    // const TotalHrsOfBreak = countBreakHours();
    const Per_State = perSelect(props?.route?.params?.per);
    const isNet = await netWorkCheck();
    console.log('TotalHrs ::: ', TotalHrs);
    const params = {
      employee_id: employee_id,
      job_title: props?.route?.params?.job_title,
      hours: TotalHrs,
      pattern_of_work: props?.route?.params?.pattern_of_work,
      type: Per_State,
      employment_start_date: props?.route?.params?.employment_start_date,
      days_of_work: props?.route?.params?.days_of_work,
    };
    console.log('callFileApi params ::: ', params);
    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_FILES, params)
        .then(value => {
          setIsLoader(false);
          console.log('Employee EMPLOYER_FILES :::: ', value);
          if (value?.data) {
            callPaySlipApi(
              employee_id,
              Per_State,
              props?.route?.params?.rands_amount,
            );
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      AlertBox({
        Title: i18n.Alert,
        Message: i18n.InternetConnectivity,
      });
    }
  };

  const callPaySlipApi = async (employee_id, per, amount) => {
    const isNet = await netWorkCheck();
    const params = {
      employee_id: employee_id,
      type: per,
      amount: amount,
    };
    console.log('callPaySlipApi params ::: ', params);

    setIsLoader(true);
    if (isNet) {
      Post_Api(EMPLOYER_PAYSLIP, params)
        .then(value => {
          setIsLoader(false);
          console.log('Employee EMPLOYER_PAYSLIP :::: ', value);
          if (value?.data) {
            AlertBox({
              Title: i18n.Alert,
              Message: 'Employee Added Successfully',
              onOkPress: () => {
                dispatch(setAddEmployJson(undefined));
                dispatch(setAddProfile(undefined));
                NavigationService.navigate(ScreenName.EmployerHome);
              },
            });
          }
        })
        .catch(error => {
          setIsLoader(false);
        });
    } else {
      AlertBox({
        Title: i18n.Alert,
        Message: i18n.InternetConnectivity,
      });
    }
  };

  //countTotalHours
  const countTotalHours = () => {
    const startShiftTime = moment(
      props?.route?.params?.work_from,
      'DD-MM-YYYY hh:mm:ss A',
    );
    const endShiftTime = moment(
      props?.route?.params?.work_to,
      'DD-MM-YYYY hh:mm:ss A',
    );
    console.log(moment(startShiftTime).format('HH:mm A'));
    console.log(moment(endShiftTime).format('HH:mm A'));
    const duration = moment.duration(startShiftTime.diff(endShiftTime));
    const TotalHrs = Math.abs(duration.asHours());
    const LunchHrs = props?.route?.params?.lunch == '1 HOUR' ? 1 : 0.5;
    console.log('LunchHrs :: ', LunchHrs);
    console.log('TotalHrs :: ', TotalHrs);
    const minusHRS = TotalHrs - LunchHrs;
    console.log('minusHRS :: ', minusHRS);

    return minusHRS.toFixed(1);
  };

  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.AddNewEmploye}</Text>
            <Text style={[styles.H2Text]}>{i18n.TRD}</Text>
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              <View style={[styles.Box, {marginTop: 10}]}>
                <ScrollView>
                  <Text
                    style={[
                      styles.H2Text,
                      {fontWeight: '700', color: 'black', marginBottom: 10},
                    ]}>
                    {'Acknowledgement'}
                  </Text>
                  <Text style={[styles.H2Text, {textAlign: 'justify'}]}>
                    {
                      'I acknowledge and agree that I have correctly entered all my information and hereby exclude any liability to SheSha LawZa. I acknowledged and understand, if I input information inaccurately, the resulting output may be incorrect. I will not hold SheSha LawZa liable for any delays caused due to incorrect information provided.'
                    }
                  </Text>
                </ScrollView>
              </View>
              <CommonButton
                Title={i18n.YesAdree}
                OnPress={() => yesAgreeButton()}
              />
              <CommonButton
                Title={i18n.GoBack}
                OnPress={() => NavigationService.goBack()}
              />
              <CommanLoader isVisible={isLoader} />
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
});

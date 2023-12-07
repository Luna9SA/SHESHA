import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import FilesView from '../FilesView/FilesView';
import {netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {EMPLOYER_FILES_LIST, EMPLOYER_PAYSLIP_LIST} from '../../../Apis/Api';
import CommanLoader from '../../../Components/CommanLoader';
import EmployerFilesView from '../FilesView/EmploterFileView';
import moment from 'moment';

export default function PaySlipView(props) {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  //State
  const [Color, setColor] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [PaySlipList, setPayListSlip] = useState([]);

  //PropsUseMemo
  useMemo(() => {
    setColor(props?.route?.params?.color);
  }, [props]);

  //onBackPress
  const onBackPress = () => {
    NavigationService.goBack();
  };

  //useEffect
  useEffect(() => {
    callPaySlipApi();
  }, []);

  //callPaySlipApi
  const callPaySlipApi = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      employee_id: props?.route?.params?.employee_id?.id,
    };
    console.log('employer_id : ', props?.route?.params?.employee_id?.id);
    if (isNet) {
      Post_Api(EMPLOYER_PAYSLIP_LIST, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            setPayListSlip(value?.data);
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
  //getMonthForShare
  const getMonthForGet = date => {
    return moment(date).format('MMMM');
  };
  return (
    <CommonScreen
      BackgroundColor={Color}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.PaySlip}</Text>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <View style={styles.f1}>
                <View>
                  <Text style={[styles.HText1, styles.M2]}>
                    {i18n.OtherDocument}
                  </Text>
                  {PaySlipList.length > 0 ? (
                    <EmployerFilesView
                      Array={PaySlipList}
                      onPress={item => {
                        console.log('ITEM :: ', item);
                        NavigationService.navigate(ScreenName.ShareView, {
                          color: colors.colorRed,
                          isDeleteDocument: false,
                          FileUrl: item?.pdf_file,
                          FileName: item?.payslip_date + '.Payslip',
                          name: props?.route?.params?.name,
                          employee_id: props?.route?.params?.employee_id?.id,
                          month: getMonthForGet(item?.created_at),
                        });
                      }}
                      isPayList={true}
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
                          No Payslip Available.
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
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
    marginTop: moderateVerticalScale(40),
  },
  HText: {
    marginTop: moderateVerticalScale(40),
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(30),
    color: colors.colorBlack,
  },
  HText1: {
    fontSize: moderateScale(12),
    color: colors.colorGray,
    fontWeight: '500',
    marginBottom: moderateScale(10),
  },
});

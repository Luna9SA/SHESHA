import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import images from '../../../themes/images';
import Images from '../../../themes/images';
import DatePicker from 'react-native-date-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Form_Data_Api} from '../../../ApiConsult/ApiHelper';
import {ScreenName} from '../../../Navigation/ScreenName';
import {EMPLOYER_PROFILE_TERMINATION} from '../../../Apis/Api';
import CommanLoader from '../../../Components/CommanLoader';

export default function TerminatoinDoc(props) {
  //State
  const [isNext, setISNext] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [DocArray, setDocArray] = useState([]);
  const [isLoader, setIsLoader] = useState(false);

  //NAME
  const Name =
    props?.route?.params?.item?.first_name +
    ' ' +
    props?.route?.params?.item?.last_name;
  const employee_id = props?.route?.params?.employee_id;
  const reason = props?.route?.params?.reason;

  //showReasonsItems
  const showReasonsItems = (item, index) => {
    return (
      <View style={[styles.RView]} key={index}>
        <Text style={[styles.HText, {width: '96%'}]}>{item?.name}</Text>
        <TouchableOpacity
          onPress={() => onRemoveItem(item, index)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
          }}>
          <Images.Delete />
        </TouchableOpacity>
      </View>
    );
  };

  //onRemoveItem
  const onRemoveItem = (item, index) => {
    let newData = [...DocArray];
    newData.splice(index, 1);
    setDocArray(newData);
  };

  //onNext
  const onNext = () => {
    // if (DocArray.length == 0) {
    //   AlertBox({
    //     Title: 18n.Alert,
    //     Message: 'Please Attach The Documents For Termination Employee.',
    //   });
    // } else {
    //   if (!isNext) {
    //     setISNext(true);
    //   } else {
    //     letsTerminateEmployee();
    //   }
    // }
    if (!isNext) {
      setISNext(true);
    } else {
      letsTerminateEmployee();
    }
  };

  const letsTerminateEmployee = async () => {
    var format_data = new FormData();
    const isNet = await netWorkCheck();
    setIsLoader(true);
    if (isNet) {
      format_data.append('employee_id', employee_id);
      format_data.append('reason', reason);
      format_data.append(
        'terminate_date',
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      );
      if (DocArray.length != 0) {
        for (let i = 0; i < DocArray.length; i++) {
          const element = DocArray[i];
          format_data.append('documents[]', element?.file);
        }
      }
      console.log('format_data ::: ', format_data);
      Post_Form_Data_Api(EMPLOYER_PROFILE_TERMINATION, format_data)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            AlertBox({
              Title: i18n.Alert,
              Message: value?.message,
              onOkPress: () => {
                NavigationService.navigate(ScreenName.EmployerHome);
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
  };

  //openDocument
  const openDocument = async () => {
    const response = await DocumentPicker.pick({
      presentationStyle: 'fullScreen',
      type: [types.pdf, types.images],
    });
    var NewArray = [...DocArray];
    NewArray.push({
      name: response[0].name,
      file: response[0],
    });
    setDocArray(NewArray);
  };

  return (
    <CommonScreen
      BackgroundColor={colors.colorBlack}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HMainText}>{i18n.TerminationCapital}</Text>
            {!isNext && (
              <ScrollView
                style={[styles.f1, styles.M1]}
                showsVerticalScrollIndicator={false}
                bounces={false}>
                <View>
                  <TouchableOpacity
                    style={styles.SelectTerminate}
                    onPress={() => setIsModalOpen(!isModalOpen)}>
                    <Text style={styles.HText}>
                      {i18n.SelectTerminationDate}
                    </Text>
                    <Image source={images.DropDown} style={styles.DownImage} />
                  </TouchableOpacity>
                </View>
                <View style={styles.selectDate}>
                  <Text style={styles.HText}>
                    {' '}
                    {date.getDate() +
                      '/' +
                      (date.getMonth() + 1) +
                      '/' +
                      date.getFullYear()}
                  </Text>
                </View>
                <Text style={styles.FullName}>{i18n.UpdateDoc}</Text>
                <View>
                  <TouchableOpacity
                    style={styles.SelectTerminate}
                    onPress={() => openDocument()}>
                    <Text style={styles.HText}>{i18n.UploadNewDocument}</Text>
                    <Image source={images.Add} style={styles.DownImage} />
                  </TouchableOpacity>
                </View>
                <View style={styles.M2}>
                  {DocArray.map((item, index) => showReasonsItems(item, index))}
                </View>
              </ScrollView>
            )}
            {isNext && (
              <Text style={styles.H2Text}>
                {`The termination process for (${Name}) has now been completed. Their profile has been removed from your employee list and can be found on the “Terminated Employees” page in the home page menu.`}
              </Text>
            )}
            <View style={styles.M3} />
            <CommonButton Title={i18n.Next} OnPress={() => onNext()} />
            {!isNext && (
              <CommonButton
                Title={i18n.Back}
                OnPress={() => NavigationService.goBack()}
              />
            )}
            <DatePicker
              modal
              open={isModalOpen}
              date={date}
              mode={'date'}
              onConfirm={date => {
                setIsModalOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setIsModalOpen(false);
              }}
            />
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
  },
  M1: {
    marginTop: moderateVerticalScale(50),
  },
  M2: {
    marginTop: moderateVerticalScale(4),
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
    top: moderateVerticalScale(40),
  },
  H2Text: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: moderateVerticalScale(60),
    marginHorizontal: moderateScale(20),
    marginBottom: moderateVerticalScale(30),
  },
  RView: {
    // height: verticalScale(24),
    paddingTop: 8,
    borderBottomColor: colors.colorBlack,
    borderBottomWidth: 1,
    alignItems: 'center',
    // justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(10),
    marginTop: moderateVerticalScale(10),
  },
  SelectTerminate: {
    height: verticalScale(30),
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
  FullName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: colors.lightBlack,
    letterSpacing: 0.5,
    marginTop: moderateVerticalScale(20),
  },
});

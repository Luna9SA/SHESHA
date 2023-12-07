import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import i18n from '../../../themes/i18n';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import {netWorkCheck} from '../../../Comman/constant';
import {DAY_LEAVES, GET_ALL_LEAVE_TYPES} from '../../../Apis/Api';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import CommanLoader from '../../../Components/CommanLoader';
import {ScreenName} from '../../../Navigation/ScreenName';

export default function SelectLeaveType(props) {
  //State
  const [isLoader, setIsLoader] = useState(false);
  const [leavArray, setLeaveArray] = useState([]);

  //onBackPress
  const onBackPress = () => {
    NavigationService.goBack();
  };

  //UseEffect
  useEffect(() => {
    console.log('====================================');
    console.log(props?.route?.params?.employeeData);
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

  //renderLeaveTypes
  const renderLeaveTypes = ({item, index}) => {
    console.log("Item ::", item);
    return (
      <CommonButton
        key={index}
        Title={item?.leave_type}
        OnPress={() => {
          NavigationService.navigate(ScreenName.AddDayLeave, {
            employeeData: props?.route?.params?.employeeData,
            leaveType: item,
          });
        }}
      />
    );
  };

  return (
    <CommonScreen
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <View style={{flex: 1, marginTop: 50}}>
              <Text style={[styles.HText, {alignSelf : 'center'}]}>Select Leave Type</Text>
              {/* <View style={{flexDirection: 'row'}}>
                <Text style={styles.HText1}>
                  Please select the type of leave you would like to add.if your
                  require more information on this please
                  <Text style={styles.ClickText}> CLICK HERE</Text>
                </Text>
              </View> */}
              <View style={{marginTop: 10}}>
                <FlatList
                  data={leavArray}
                  keyExtractor={(item, index) => index}
                  renderItem={renderLeaveTypes}
                />
              </View>
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
  HText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.colorBlack,
  },
  HText1: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.colorGray,
  },
  ClickText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.colorRed,
  },
});

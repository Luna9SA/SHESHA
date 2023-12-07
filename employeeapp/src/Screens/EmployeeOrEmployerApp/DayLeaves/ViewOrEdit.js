import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
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

export default function ViewOrEditLeave(props) {
  useEffect(() => {
    console.log(props?.route?.params?.employee_id?.id);
  }, [props]);

  //setFlag
  const [isView, setIsView] = useState(false);

  const onBackPress = () => {
    if (isView) {
      setIsView(false);
    } else {
      NavigationService.goBack();
    }
  };
  return (
    <CommonScreen
      BackgroundColor={colors.green1}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>
              {!isView ? 'SELECT' : 'VIEW LEAVE'}
            </Text>
            <View style={{flex: 1, justifyContent: 'center'}}>
              {!isView && (
                <View>
                  <CommonButton
                    Title={'View'}
                    OnPress={() => {
                      setIsView(true);
                    }}
                    LinerStyle={{height: verticalScale(120)}}
                  />
                  {props?.route?.params?.UserType && (
                    <CommonButton
                      Title={'Edit'}
                      OnPress={() => {
                        NavigationService.navigate(ScreenName.EditLeave, {
                          item: props?.route?.params?.item,
                          employee_id: props?.route?.params?.employee_id,
                        });
                      }}
                      LinerStyle={{height: verticalScale(120)}}
                    />
                  )}
                </View>
              )}
              {isView && (
                <View>
                  <View>
                    <Text style={styles.Header}>LEAVE TYPE</Text>
                    <Text
                      style={[styles.HText1, {textTransform: 'capitalize'}]}>
                      {props?.route?.params?.item?.reason}
                    </Text>
                  </View>
                  <View style={{marginTop: 20}}>
                    <Text style={styles.Header}>DATE</Text>
                    <Text style={styles.HText1}>
                      {props?.route?.params?.item?.start_date} to{' '}
                      {props?.route?.params?.item?.end_date}
                    </Text>
                  </View>
                  <View style={{marginTop: 20}}>
                    <Text style={styles.Header}>PAID/UNPAID</Text>
                    <Text style={styles.HText1}>
                      {props?.route?.params?.item?.leave_type}
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <CommonButton Title={i18n.Back} OnPress={() => onBackPress()} />
            {/* <CommanLoader isVisible={isLoader} /> */}
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
    alignSelf: 'center',
    top: 40,
  },
  HText1: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.colorBlack,
    alignSelf: 'center',
  },
  ClickText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.colorRed,
  },
  Header: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.colorBlack,
    alignSelf: 'center',
  },
});

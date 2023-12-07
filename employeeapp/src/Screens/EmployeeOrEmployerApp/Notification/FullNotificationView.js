import {Image, StyleSheet, Text, View} from 'react-native';
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
import NScaleView from './NScaleView';
import LeaveView from '../DayLeaves/LeaveView';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import CommonMenuLogo from '../../../Components/CommanMenuLogo';
import DrawerModal from '../../../Components/DrawerModal';
import {useIsFocused} from '@react-navigation/native';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {NOTIFICATION_DATA, READ_NOTIFICATION} from '../../../Apis/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {userOfData} from '../../../ReduxConfig/Slice/UserDataSlice';
import CommanLoader from '../../../Components/CommanLoader';

export default function FullNotificationView(props) {
  const USER_ID_STATE = useSelector(userOfData);
  console.log('USER_DATA ', USER_ID_STATE.payload?.UserData?.data?.id);
  //State
  const [isMenu, setIsMenu] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const isFocus = useIsFocused();

  //MEMO PROPS
  useMemo(() => {
    setIsMenu(props?.route?.params?.isMenu);
  }, [props]);

  //   /onModalOpen
  const onModalOpen = () => {
    setIsModal(!isModal);
  };

  //FOCUS
  useEffect(() => {
    if (props?.route?.params?.Data?.is_read == 0) {
      readNotification();
    }
  }, []);

  const readNotification = async () => {
    const isNet = await netWorkCheck();
    const fcm_token = await AsyncStorage.getItem('fcmtoken');
    setIsLoader(true);
    const params = {
      user_id: USER_ID_STATE.payload?.UserData?.data?.id,
      notification_id: props?.route?.params?.Data?.id,
      fcm_token: fcm_token,
    };
    if (isNet) {
      Post_Api(READ_NOTIFICATION, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            console.log('NOTIFICATION :: ', value?.data);
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

  return (
    <CommonScreen
      BackgroundColor={colors.colorBlack}
      Container={() => {
        return (
          <View style={styles.Container}>
            {isMenu && (
              <View>
                <CommonMenuLogo onPress={() => onModalOpen()} />
                <CommonLogo isRight />
              </View>
            )}
            {!isMenu && <CommonLogo />}
            <View style={styles.Container1}>
              <LeaveView Title={props?.route?.params?.Data?.title} />
              <Text style={styles.DText}>
                {props?.route?.params?.Data?.description}
              </Text>
              <View
                style={[
                  styles.ImageView,
                  props?.route?.params?.Data?.img_url == null && {
                    backgroundColor: colors.lightGray,
                  },
                ]}>
                {props?.route?.params?.Data?.img_url == null && (
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '800',
                      alignSelf: 'center',
                    }}>
                    IMAGE
                  </Text>
                )}
                {console.log(props?.route?.params?.Data?.img_url)}
                {props?.route?.params?.Data?.img_url != null && (
                  <Image
                    source={{uri: props?.route?.params?.Data?.img_url}}
                    style={{
                      height: verticalScale(140),
                      width: verticalScale(200),
                    }}
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>
            <CommonButton Title={i18n.View} />
            <CommonButton
              Title={i18n.Back}
              OnPress={() => NavigationService.goBack()}
            />
            {isModal && (
              <DrawerModal
                isModalOpen={isModal}
                onCloseButton={() => onModalOpen()}
              />
            )}
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
  Container1: {
    // flex: 1,
    borderWidth: moderateScale(1.5),
    borderColor: colors.colorGray,
    borderRadius: 10,
    padding: moderateScale(10),
    marginTop: moderateVerticalScale(50),
    marginBottom: moderateVerticalScale(20),
  },
  DText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    color: colors.colorGray,
    marginTop: moderateScale(10),
  },
  ImageView: {
    height: verticalScale(140),
    width: verticalScale(200),
    alignSelf: 'center',
    marginTop: moderateVerticalScale(10),
    marginBottom: moderateVerticalScale(10),
    borderWidth: moderateScale(1),
    borderColor: colors.colorGray,
    justifyContent: 'center',
  },
});

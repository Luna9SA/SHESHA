import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import CommonLogo from '../../../Components/CommanLogo';
import i18n from '../../../themes/i18n';
import NScaleView from './NScaleView';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import CommonButton from '../../../Components/CommanButton';
import CommonMenuLogo from '../../../Components/CommanMenuLogo';
import DrawerModal from '../../../Components/DrawerModal';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {EMPLOYER_PROFILE, NOTIFICATION_DATA} from '../../../Apis/Api';
import {useSelector} from 'react-redux';
import {userOfData} from '../../../ReduxConfig/Slice/UserDataSlice';
import { useIsFocused } from '@react-navigation/native';
import CommanLoader from '../../../Components/CommanLoader';

export default function NotificationView(props) {
  const USER_ID_STATE = useSelector(userOfData);
  console.log('USER_DATA ', USER_ID_STATE.payload?.UserData?.data?.id);
  //State
  const [isMenu, setIsMenu] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [NotificationData, setNotificationData] = useState([]);
  // const isFocus = useIsFocused();

  //onNotificationPress
  const onNotificationPress = item => {
    NavigationService.navigate(ScreenName.FullNotificationView, {
      isMenu: true,
      Data: item,
    });
  };

  //MEMO PROPS
  useMemo(() => {
    setIsMenu(props?.route?.params?.isMenu);
  }, [props]);

  //   /onModalOpen
  const onModalOpen = () => {
    setIsModal(!isModal);
  };

  //CallNotificationApi
  useEffect(() => {
    getNotificationData();
  }, []);

  const getNotificationData = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      user_id: USER_ID_STATE.payload?.UserData?.data?.id,
    };
    if (isNet) {
      Post_Api(NOTIFICATION_DATA, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            setNotificationData(value?.data);
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
            {!isMenu && <CommonLogo />}
            {isMenu && (
              <View>
                <CommonMenuLogo onPress={() => onModalOpen()} />
                <CommonLogo isRight />
              </View>
            )}
            <View style={{flex: 1}}>
              <Text style={styles.HText}>{i18n.Notification}</Text>
              {NotificationData.length != 0 && (
                <FlatList
                  data={NotificationData}
                  keyExtractor={(item, index) => index}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => onNotificationPress(item)}
                        key={index}>
                        <NScaleView
                          isNew={item?.is_read}
                          description={item?.description}
                          Title={item?.title}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
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
            <CommanLoader  isVisible={isLoader}/>
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
});

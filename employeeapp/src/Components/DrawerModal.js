import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {colors} from '../themes';
import CommonButton from './CommanButton';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import Images from '../themes/images';
import images from '../themes/images';
import i18n from '../themes/i18n';
import NavigationService from '../Navigation/NavigationService';
import {ScreenName} from '../Navigation/ScreenName';
import {useDispatch} from 'react-redux';
import {selectTerminatedType} from '../ReduxConfig/Slice/TypeofEmploy';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function DrawerModal({isModalOpen, onCloseButton}) {
  //Dispatch
  const dispatch = useDispatch();

  //onButtonPress
  const onButtonPress = Type => {
    if (i18n.Notification === Type) {
      onCloseButton && onCloseButton();
      NavigationService.navigate(ScreenName.NotificationView, {isMenu: true});
    }
    if (i18n.TerminatedEmploy === Type) {
      dispatch(selectTerminatedType(i18n.TerminatedEmploy));
      NavigationService.navigate(ScreenName.EmployerHome, {isMenu: true});
      onCloseButton && onCloseButton();
    }

    if (i18n.MyProfile === Type) {
      NavigationService.navigate(ScreenName.MyProfile, {isMenu: true});
      onCloseButton && onCloseButton();
    }
  };

  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={isModalOpen}>
        <SafeAreaView style={styles.centeredView}>
          <View style={styles.Container}>
            <TouchableOpacity onPress={() => onCloseButton && onCloseButton()}>
              <Images.Close />
            </TouchableOpacity>
            <Image source={images.SheshMenuLogo} style={styles.ImageLogo} />
            <Text style={styles.HText}>{i18n.Menu}</Text>
            <View style={styles.M1} />
            <CommonButton
              Title={i18n.Notification}
              OnPress={() => onButtonPress(i18n.Notification)}
            />
            <CommonButton
              Title={i18n.TerminatedEmploy}
              OnPress={() => onButtonPress(i18n.TerminatedEmploy)}
            />
            <CommonButton
              Title={i18n.MyProfile}
              OnPress={() => onButtonPress(i18n.MyProfile)}
            />
          </View>
          <View style={styles.p1}>
            <CommonButton
              Title={i18n.Logout}
              OnPress={() => {
                NavigationService.navigate(ScreenName.LogOut,{color : colors.colorRed}),
                  onCloseButton && onCloseButton();
              }}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: colors.colorWhite,
  },
  Container: {
    flex: 1,
    paddingHorizontal: moderateScale(30),
    paddingTop: moderateScale(30),
  },
  p1: {
    paddingHorizontal: moderateScale(20),
    marginBottom: moderateVerticalScale(20),
  },
  ImageLogo: {
    height: verticalScale(44),
    width: verticalScale(160),
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
  HText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.colorBlack,
    alignSelf: 'center',
    marginTop: moderateVerticalScale(26),
  },
  M1: {
    marginTop: moderateVerticalScale(30),
  },
});

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import CommonScreen from '../../Components/CommanScreen';
import images from '../../themes/images';
import {colors} from '../../themes';
import i18n from '../../themes/i18n';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from 'react-native-size-matters';
import CommonButton from '../../Components/CommanButton';
import NavigationService from '../../Navigation/NavigationService';
import {ScreenName} from '../../Navigation/ScreenName';
import CommonLogo from '../../Components/CommanLogo';
import {useEffect} from 'react';
import {AlertBox, netWorkCheck} from '../../Comman/constant';
import {useDispatch} from 'react-redux';
import {
  userOfData,
  userToken,
  whoLogin,
} from '../../ReduxConfig/Slice/UserDataSlice';
import {TERMS_ADN_CONDITION} from '../../Apis/Api';
import {Post_Api} from '../../ApiConsult/ApiHelper';
import CommanLoader from '../../Components/CommanLoader';
import RenderHTML from 'react-native-render-html';

export default function WelcomeScreen() {
  const dispatch = useDispatch();

  //OnButtonPress
  const onButtonPress = () => {
    NavigationService.navigate(ScreenName.ChooseEmployee);
  };

  //STATE
  const [isLoader, setIsLoader] = useState(false);
  const [source, setSource] = useState(undefined);

  useEffect(() => {
    interNetConnect();
    if ((global.isAuthorized = true)) {
      dispatch(userOfData(undefined));
      dispatch(userToken(undefined));
      dispatch(whoLogin(undefined));
      global.AccessToken = undefined;
      global.isAuthorized = false;
    }
  }, []);

  //useEffect
  useEffect(() => {
    TermsAndCondition();
  }, []);

  //TRD
  const TermsAndCondition = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      page: 'Landing',
    };
    if (isNet) {
      Post_Api(TERMS_ADN_CONDITION, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            console.log('value :::::', value?.data);
            setSource(value?.data?.content);
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

  //interNetConnect
  const interNetConnect = async () => {
    const isNet = await netWorkCheck();
    if (!isNet) {
      AlertBox({
        Title: i18n.Alert,
        Message: i18n.InternetConnectivity,
      });
    }
  };

  const {width} = useWindowDimensions();
  console.debug('source ::', source);
  return (
    <CommonScreen
      BackgroundColor={colors.colorBlack}
      Container={() => {
        return (
          <View style={styles.Container}>
            <View style={styles.WelcomeTextView}>
              <Text style={styles.WelcomeText}>{i18n.Welcome}</Text>
            </View>
            <View>
              <Image source={images.SheshMenuLogo} style={styles.LogoStyle} />
            </View>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {source && (
                <RenderHTML source={{html: source}} contentWidth={width} />
              )}
              {!isLoader && (
                <CommonButton
                  Title={i18n.LoginAndRegister}
                  OnPress={() => onButtonPress()}
                />
              )}
            </ScrollView>
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
  WelcomeText: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.colorBlack,
  },
  WelcomeTextView: {
    alignSelf: 'center',
    marginTop: moderateVerticalScale(10),
  },
  LogoStyle: {
    height: verticalScale(70),
    width: verticalScale(260),
    alignSelf: 'center',
    marginTop: moderateVerticalScale(4),
  },
  WDescriptionText: {
    marginTop: moderateVerticalScale(10),
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.colorBlack,
  },
  ImageView: {
    backgroundColor: 'gray',
    height: verticalScale(140),
    marginTop: moderateVerticalScale(10),
  },
});

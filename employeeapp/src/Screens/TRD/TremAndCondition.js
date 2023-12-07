import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CommonScreen from '../../Components/CommanScreen';
import {useSelector} from 'react-redux';
import {selectEmployType} from '../../ReduxConfig/Slice/TypeofEmploy';
import {colors} from '../../themes';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import CommonLogo from '../../Components/CommanLogo';
import LinearGradient from 'react-native-linear-gradient';
import CommonButton from '../../Components/CommanButton';
import i18n from '../../themes/i18n';
import NavigationService from '../../Navigation/NavigationService';
import {AlertBox, netWorkCheck} from '../../Comman/constant';
import {Post_Api} from '../../ApiConsult/ApiHelper';
import {EMPLOYER_PROFILE, TERMS_ADN_CONDITION} from '../../Apis/Api';
import RenderHTML, { defaultSystemFonts } from 'react-native-render-html';
import CommanLoader from '../../Components/CommanLoader';

export default function TermsAndCondition() {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  //state
  const [isLoader, setIsLoader] = useState(false);
  const [source, setSource] = useState(undefined);

  //OnGoBack
  const onGoBack = () => {
    NavigationService.goBack();
  };

  //useEffect
  useEffect(() => {
    TermsAndCondition();
  }, []);

  //TRD
  const TermsAndCondition = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      page:
        typeOfEmployState == i18n.Employer
          ? 'Terms & condition1'
          : 'Terms & condition2',
    };
    console.log('====================================');
    console.log('TRD : ' , params);
    console.log('====================================');
    if (isNet) {
      Post_Api(TERMS_ADN_CONDITION, params)
        .then(value => {
          console.log('TRD valu : ', value);
          setIsLoader(false);
          if (value?.data) {
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

  return (
    <CommonScreen
      BackgroundColor={
        typeOfEmployState == i18n.Employer ? colors.colorRed : colors.yellow
      }
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <ScrollView
              style={styles.M1}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <View>
                <Text style={styles.TRD}>{i18n.TRD}</Text>
                <LinearGradient
                  colors={[
                    '#000000',
                    '#FEB81C',
                    '#F1B41E',
                    '#D1AC23',
                    '#9C9F2D',
                    '#538C3A',
                    '#007749',
                    '#1B6F46',
                    '#6F593D',
                    '#AC4937',
                    '#D13F33',
                    '#E03C32',
                    '#001389',
                  ]}
                  start={{x: 0.0, y: 1.0}}
                  end={{x: 1.0, y: 1.0}}
                  style={[styles.gradient]}>
                  <View style={[styles.buttonContainer]}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      bounces={false}>
                      {source && <RenderHTML source={{html: source}} systemFonts={[...defaultSystemFonts, 'Montserrat-Regular', 'Montserrat-Bold']}/>}
                    </ScrollView>
                  </View>
                </LinearGradient>
                <View style={styles.M2}>
                  <CommonButton
                    Title={i18n.GoBack}
                    OnPress={() => onGoBack()}
                  />
                </View>
              </View>
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
  gradient: {
    height: verticalScale(300),
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    margin: moderateScale(10),
  },
  buttonContainer: {
    flex: 1.0,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.colorWhite,
    width: '98%',
    margin: moderateScale(2),
    borderRadius: moderateScale(6),
    padding: moderateScale(8),
  },
  M1: {
    marginTop: verticalScale(50),
  },
  M2: {
    marginTop: verticalScale(10),
  },
  TRD: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.colorBlack,
    marginBottom: verticalScale(6),
    alignSelf: 'center',
  },
});

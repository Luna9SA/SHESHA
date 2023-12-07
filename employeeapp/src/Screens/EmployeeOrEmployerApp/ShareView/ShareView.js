import {
  InteractionManager,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import CommonScreen from '../../../Components/CommanScreen';
import {useSelector} from 'react-redux';
import {selectEmployType} from '../../../ReduxConfig/Slice/TypeofEmploy';
import i18n from '../../../themes/i18n';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import NavigationService from '../../../Navigation/NavigationService';
import CommonTextInput from '../../../Components/CommanTextInput';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {
  DELETE_DOCUMENTS,
  EMPLOYER_FILES_LIST,
  EMPLOYER_SHARE,
  EMPLOYER_SHARE_PAYSLIP,
} from '../../../Apis/Api';
import {EmailValidation} from '../../../Comman/validation';
import CommanLoader from '../../../Components/CommanLoader';
import Share from 'react-native-share';
import {ScreenName} from '../../../Navigation/ScreenName';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default function ShareView(props) {
  //ReduxState
  const TypeOfEmploy = useSelector(selectEmployType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;

  const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
    setIsKeyBordOpen(true);
  });
  const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
    setIsKeyBordOpen(false);
  });

  //State
  const [Color, setColor] = useState('');
  const [isEmail, setIsEmail] = useState(false);
  const [Email, setEmail] = useState('');
  const [isDeleteButton, setIsDeleteButton] = useState(undefined);
  const [FileUrl, setFileUrl] = useState(undefined);
  const [FileName, setFileName] = useState(undefined);
  const [isLoader, setIsLoader] = useState(false);
  const [isKeybordOpen, setIsKeyBordOpen] = useState(false);
  const [isFileSharePath, setIsFileSharePath] = useState(undefined);

  //PropsUseMemo
  useEffect(() => {
    setColor(props?.route?.params?.color);
    setIsDeleteButton(props?.route?.params?.isDeleteDocument);
    setFileUrl(props?.route?.params?.FileUrl);
    setFileName(props?.route?.params?.FileName);
    console.log('====================================');
    console.log('props :: ', props?.route);
    console.log('====================================');
  }, [props]);

  //onBackPress
  const onBackPress = () => {
    if (isEmail) {
      setIsEmail(false);
      // setIsDeleteButton(true);
    } else {
      NavigationService.goBack();
    }
  };

  //onEmailPress
  const onEmailPress = () => {
    if (!isEmail) {
      setIsEmail(true);
      setIsDeleteButton(false);
    }
    if (isEmail) {
      const Email_validation = EmailValidation(Email);
      if (Email_validation) {
        AlertBox({Title: i18n.Alert, Message: i18n.EmailError});
      } else {
        SharePDF();
      }
      // setIsDeleteButton(true);
    }
  };

  //viewPdf
  const viewPdf = () => {
    console.log('====================================');
    console.log('das : ', FileUrl);
    console.log('====================================');
    const f2 = FileUrl.split('/');
    const fileName = f2[f2.length - 1];

    NavigationService.navigate(ScreenName.PdfViewer, {
      url: FileUrl,
      isPDF: fileName.includes('pdf'),
    });
  };

  //SharePDF
  const SharePDF = async () => {
    const isNet = await netWorkCheck();
    const Email_validation = EmailValidation(Email);
    // setIsLoader(true);
    const params = {
      pdf_file: FileUrl,
      email: Email.trim(),
      month : props?.route?.params?.month,
      employee_id : props?.route?.params?.employee_id,
    };
    console.log('SharePDF : ', params);
    if (isNet) {
      if (Email_validation) {
        AlertBox({Title: i18n.Alert, Message: Email_validation});
        setIsLoader(false);
      } else {
        const URL =
          props?.route?.params?.name == i18n.Files
            ? EMPLOYER_SHARE
            : EMPLOYER_SHARE_PAYSLIP;
        Post_Api(URL, params)
          .then(value => {
            setIsLoader(false);
            console.log(value?.data);
            if (value?.data) {
              AlertBox({
                Title: i18n.Alert,
                Message: value?.message,
                onOkPress: () => {
                  NavigationService.goBack();
                },
              });
            }
          })
          .catch(error => {
            setIsLoader(false);
          });
      }
    } else {
      setIsLoader(false);
      AlertBox({Title: i18n.Alert, Message: i18n.InternetConnectivity});
    }
  };

  //onDownload
  const onDownload = () => {
    downloadHistory();
  };

  const downloadHistory = async () => {
    setIsLoader(true);
    const {config, fs} = ReactNativeBlobUtil;
    const Download = fs?.dirs?.DownloadDir;
    return config({
      fileCache: true,
      indicator: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: Download + '/' + FileName,
      },
    })
      .fetch('GET', FileUrl)
      .then(res => {
        setIsLoader(false);
        AlertBox({Title: i18n.Alert, Message: 'Download successfully.'});
      })
      .catch(error => {
        AlertBox({Title: i18n.Alert, Message: error});
        console.log(error), setIsLoader(false);
      });
  };

  //onDelete
  const onDelete = async () => {
    const isNet = await netWorkCheck();
    console.log('employee_id : ', props?.route?.params?.employee_id);
    setIsLoader(true);
    const params = {
      employee_id: props?.route?.params?.employee_id,
      pdf_file: FileUrl,
    };
    console.log('DELETE DOCUMENT PARAM : ', params);
    if (isNet) {
      Post_Api(DELETE_DOCUMENTS, params)
        .then(value => {
          setIsLoader(false);
          if (value?.data) {
            AlertBox({
              Title: i18n.Alert,
              Message: value?.message,
              onOkPress: () => {
                NavigationService.goBack();
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

  //ShareDoc
  const ShareDoc = () => {
    // if (isFileSharePath) {
      InteractionManager.runAfterInteractions(async () => {
        console.log('====================================');
        console.log('FileUrl: ',FileUrl);
        console.log('====================================');
        try {
          const shareResponse = await Share.open({
            type: '',
            url: FileUrl,
          });
          console.log('====================================');
          console.log('Share : ', shareResponse);
          console.log('====================================');
          // await ReactNativeBlobUtil.fs.unlink(isFileSharePath);
        } catch (error) {
          console.log('====================================');
          console.log('error : ', error);
          console.log('====================================');
        }
      });
    // }
  };

  return (
    <CommonScreen
      BackgroundColor={Color}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <Text style={styles.HText}>{i18n.Share}</Text>
            {!isEmail && (
              <ScrollView
                style={styles.f1}
                showsVerticalScrollIndicator={false}>
                <CommonButton
                  LinerStyle={styles.gradient}
                  Title={i18n.Download}
                  OnPress={() => onDownload()}
                />
                <CommonButton
                  LinerStyle={styles.gradient}
                  Title={i18n.Email}
                  OnPress={() => onEmailPress()}
                />
                <CommonButton
                  LinerStyle={styles.gradient}
                  Title={'View'}
                  OnPress={() => viewPdf()}
                />
                <CommonButton
                  LinerStyle={styles.gradient}
                  Title={'Share'}
                  OnPress={() => ShareDoc()}
                />
              </ScrollView>
            )}
            {isEmail && (
              <View style={[styles.f1, styles.M1]}>
                <Text style={styles.EmailText}>{i18n.ShareEmail}</Text>
                <CommonTextInput
                  Value={Email.trim()}
                  onChange={t => setEmail(t)}
                  PlaceHolder={i18n.EmailAddress}
                />
                <CommonButton
                  Title={i18n.Next}
                  OnPress={() => onEmailPress()}
                />
              </View>
            )}
            {isDeleteButton && (
              <CommonButton
                Title={i18n.DeleteDocument}
                TitleStyle={styles.TitleStyle}
                OnPress={() => onDelete()}
                ViewStyle={styles.BUttonStyle}
              />
            )}
            {!isKeybordOpen && (
              <CommonButton Title={i18n.Back} OnPress={() => onBackPress()} />
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
  HText: {
    marginTop: moderateVerticalScale(40),
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(30),
    color: colors.colorBlack,
  },
  gradient: {
    height: verticalScale(120),
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    margin: moderateScale(10),
  },
  EmailText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: moderateScale(10),
    color: colors.colorBlack,
  },
  BUttonStyle: {
    backgroundColor: colors.colorRed,
  },
  TitleStyle: {
    color: colors.colorWhite,
  },
});

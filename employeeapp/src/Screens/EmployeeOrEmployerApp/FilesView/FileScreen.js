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
import {useDispatch, useSelector} from 'react-redux';
import {
  selectEmployType,
  selectFileOrPayType,
} from '../../../ReduxConfig/Slice/TypeofEmploy';
import i18n from '../../../themes/i18n';
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import FilesView from './FilesView';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import UploadFile from './UploadFile';
import EmployerFilesView from './EmploterFileView';
import CommanLoader from '../../../Components/CommanLoader';
import {Post_Api, Post_Form_Data_Api} from '../../../ApiConsult/ApiHelper';
import {
  EMPLOYEE_PROFILE,
  EMPLOYER_FILES_LIST,
  OTHER_DOCUMENT_ADD,
} from '../../../Apis/Api';
import {netWorkCheck} from '../../../Comman/constant';
import DocumentPicker, {types} from 'react-native-document-picker';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';

//DUMMMY ARRAY
const Array1 = [
  {
    name: 'Document 1',
  },
  {
    name: 'Document 2',
  },
  {
    name: 'Document 3',
  },
  {
    name: 'Document 4',
  },
];

//DUMMMY ARRAY
const Array2 = [
  {
    name: 'Document 1',
  },
  {
    name: 'Document 2',
  },
];

export default function FileScreen(props) {
  //ReduxState
  const dispatch = useDispatch();
  const focus = useIsFocused();
  const TypeOfEmploy = useSelector(selectEmployType);
  const TypeOfFile = useSelector(selectFileOrPayType);
  const typeOfEmployState = TypeOfEmploy?.payload?.TypeOfEmp?.Type;
  const TypeOFFile = TypeOfFile?.payload?.TypeOfEmp?.FileOrSlipType;
  console.debug(TypeOFFile);
  //State
  const [Color, setColor] = useState('');
  const [EmployerFiles, setEmployerFiles] = useState(undefined);
  const [isLoader, setIsLoader] = useState(false);

  //PropsUseMemo
  useMemo(() => {
    setColor(props?.route?.params?.color);
  }, [props]);

  //onBackPress
  const onBackPress = () => {
    dispatch(selectFileOrPayType(''));
    NavigationService.goBack();
  };

  //CALL FILES APIS
  useEffect(() => {
    callEmployerFiles();
    setEmployerFiles([]);
  }, [props]);

  //callEmployerFiles
  const callEmployerFiles = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      employee_id: props?.route?.params?.employee_id?.id,
    };
    console.log('employee_id : ', props?.route?.params?.employee_id?.id);
    if (isNet) {
      Post_Api(EMPLOYER_FILES_LIST, params)
        .then(value => {
          setIsLoader(false);
          console.log('Employee FILE' + value?.data);
          if (value?.data) {
            setEmployerFiles(value?.data);
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
    if (response) {
      uploadDocument(response[0]);
    }
  };

  const uploadDocument = async file => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      employee_id: props?.route?.params?.employee_id?.id,
    };

    const formdata = new FormData();
    formdata.append('employee_id', props?.route?.params?.employee_id?.id);
    formdata.append('type', 'other');
    formdata.append('document', file);

    if (isNet) {
      Post_Form_Data_Api(OTHER_DOCUMENT_ADD, formdata)
        .then(value => {
          setIsLoader(false);
          console.log(value?.data);
          if (value?.data) {
            callEmployerFiles();
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
            <Text style={styles.HText}>{'DOCUMENTS'}</Text>
            {TypeOFFile == i18n.EmployerFiles && (
              <TouchableOpacity onPress={() => openDocument()}>
                <UploadFile />
              </TouchableOpacity>
            )}
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <View style={styles.f1}>
                <View>
                  {EmployerFiles &&
                  ((EmployerFiles?.documentfile &&
                    EmployerFiles?.documentfile?.length > 0) ||
                    (EmployerFiles?.otherfile &&
                      EmployerFiles?.otherfile?.length > 0)) ? (
                    <View>
                      {EmployerFiles?.documentfile &&
                        EmployerFiles?.documentfile?.length > 0 && (
                          <View>
                            <Text style={[styles.HText1, styles.M2]}>
                              {i18n.MainContract}
                            </Text>
                            <EmployerFilesView
                              Array={EmployerFiles?.documentfile}
                              onPress={item => {
                                console.log('ITEM :: ', item?.pdf_file);
                                NavigationService.navigate(
                                  ScreenName.ShareView,
                                  {
                                    color: colors.Blue,
                                    isDeleteDocument: false,
                                    FileUrl: item?.pdf_file,
                                    FileName: item?.pdf_name,
                                    name: props?.route?.params?.name,
                                    employee_id:
                                      props?.route?.params?.employee_id?.id,
                                    month: getMonthForGet(item?.created_at),
                                  },
                                );
                              }}
                              isPayList={false}
                            />
                          </View>
                        )}

                      {EmployerFiles?.otherfile &&
                        EmployerFiles?.otherfile?.length > 0 && (
                          <View>
                            <Text style={[styles.HText1, styles.M2]}>
                              {i18n.OtherDocument}
                            </Text>
                            <EmployerFilesView
                              Array={EmployerFiles?.otherfile}
                              onPress={item => {
                                console.log('ITEM :: ', item);
                                NavigationService.navigate(
                                  ScreenName.ShareView,
                                  {
                                    color: colors.Blue,
                                    isDeleteDocument:
                                      props?.route?.params?.isDelete,
                                    FileUrl: item?.pdf_file,
                                    FileName: item?.pdf_name,
                                    name: props?.route?.params?.name,
                                    employee_id:
                                      props?.route?.params?.employee_id?.id,
                                    month: getMonthForGet(item?.created_at),
                                  },
                                );
                              }}
                              isPayList={false}
                            />
                          </View>
                        )}
                    </View>
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
                          No File Available.
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
  M2: {
    marginTop: moderateVerticalScale(20),
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

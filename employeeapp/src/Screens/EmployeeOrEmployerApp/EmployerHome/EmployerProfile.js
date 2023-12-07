import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import CommonLogo from '../../../Components/CommanLogo';
import CommonButton from '../../../Components/CommanButton';
import i18n from '../../../themes/i18n';
import NavigationService from '../../../Navigation/NavigationService';
import {ScreenName} from '../../../Navigation/ScreenName';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectFileOrPayType,
  selectTerminatedType,
} from '../../../ReduxConfig/Slice/TypeofEmploy';
import {AlertBox, netWorkCheck} from '../../../Comman/constant';
import {Post_Api} from '../../../ApiConsult/ApiHelper';
import {DELETE_PROFILE, EMPLOYEE_PROFILE} from '../../../Apis/Api';
import CommanLoader from '../../../Components/CommanLoader';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import images from '../../../themes/images';

export default function EmployerProfile(props) {
  //FOCUS
  const Focus = useIsFocused();

  //Redux
  const dispatch = useDispatch();
  const TerminateState = useSelector(selectTerminatedType);
  const Terminated = TerminateState?.payload?.TypeOfEmp?.Terminated;

  //State
  const [Color, setColor] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [ProfileData, setProfileData] = useState(undefined);
  const [imageLoader, setImageLoader] = useState(false);
  const [OtherData, setOtherData] = useState(undefined);
  const [isDropFlag, setIsDropFlag] = useState(false);

  //onButtonPress
  const onButtonPress = Type => {
    console.log(Type);
    if (i18n.Files === Type) {
      Terminated !== i18n.TerminatedEmploy &&
        dispatch(selectFileOrPayType(i18n.EmployerFiles));
      NavigationService.navigate(ScreenName.FileScreen, {
        color:
          Terminated === i18n.TerminatedEmploy ? colors.colorRed : colors.Blue,
        employee_id: ProfileData,
        name: i18n.Files,
        isDelete: Terminated !== i18n.TerminatedEmploy ? true : false,
      });
    }
    if (i18n.PaySlip === Type) {
      NavigationService.navigate(ScreenName.PaySlipView, {
        color: colors.colorRed,
        employee_id: ProfileData,
      });
    }
    if (i18n.Leave === Type) {
      NavigationService.navigate(ScreenName.DaysLeave, {
        color:
          Terminated === i18n.TerminatedEmploy
            ? colors.colorRed
            : colors.green1,
        employee_id: ProfileData,
      });
    }
    if (i18n.Terminate === Type) {
      NavigationService.navigate(ScreenName.Termination, {
        item: ProfileData,
        employee_id: ProfileData?.id,
      });
    }

    if (i18n.Back === Type) {
      NavigationService.goBack();
    }
  };

  //PropsMemo
  useMemo(() => {
    setColor(props?.route?.params?.color);
  }, [props]);

  //USE_EFFECT
  useEffect(() => {
    getProfileData();
  }, [Focus]);

  //getProfileData
  const getProfileData = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      employee_id: props?.route?.params?.employee_id,
    };
    if (isNet) {
      Post_Api(EMPLOYEE_PROFILE, params)
        .then(value => {
          setIsLoader(false);
          console.log(value?.data);
          if (value?.data) {
            setProfileData(value?.data);
            makeOtherDetailsArray(value?.data);
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
  console.log(imageLoader);

  const DeleteProfile = async () => {
    const isNet = await netWorkCheck();
    setIsLoader(true);
    const params = {
      employee_id: ProfileData?.id,
    };
    if (isNet) {
      Post_Api(DELETE_PROFILE, params)
        .then(value => {
          setIsLoader(false);
          console.log(value);
          if (value?.data) {
            NavigationService.goBack();
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

  const makeOtherDetailsArray = otherData => {
    const otherDataArray = [
      {
        title: 'Job title',
        body: otherData?.job_details?.job_title,
      },
      {
        title: 'Job Duties',
        body: otherData?.job_details?.job_duties,
        isDutiesOpen: false,
      },
      {
        title: 'UIF reference number',
        body: otherData?.bank_Details?.UIF_reference_number,
      },
      {
        title: 'Bank name',
        body: otherData?.bank_Details?.bank_name,
      },
      {
        title: 'Account number',
        body: otherData?.bank_Details?.account_number,
      },
      {
        title: 'Account type',
        body: otherData?.bank_Details?.account_type,
      },
      {
        title: 'Bank account holder name',
        body: otherData?.bank_Details?.holder_name,
      },
      {
        title: 'Email',
        body: otherData?.email,
      },
      {
        title: 'Physical address',
        body: otherData?.physical_address,
      },
      {
        title: 'Employee start date',
        body: otherData?.job_details?.employment_start_date,
      },
      {
        title: 'Emergency contact person name',
        body: otherData?.contact_person_name,
      },
      {
        title: 'Emergency contact person number',
        body: otherData?.contact_person_number,
      },
      {
        title: 'Salary',
        body: otherData?.salary,
      },
      {
        title: 'Pattern of work',
        body: otherData?.job_details?.pattern_of_work,
      },
    ];
    console.log('====================================');
    console.log(otherData?.salary);
    console.log('====================================');
    setOtherData(otherDataArray);
  };

  //jpbDutiesFlag
  const jpbDutiesFlag = (item, index) => {
    const newArray = [...OtherData];
    newArray[index].isDutiesOpen =
      newArray[index].isDutiesOpen == true ? false : true;
    setOtherData(newArray);
  };
  return (
    <CommonScreen
      BackgroundColor={Color}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <ScrollView
              style={styles.M1}
              showsVerticalScrollIndicator={true}
              bounces={false}>
              {ProfileData && (
                <Text style={styles.HText}>
                  {/* Profile of{' '} */}
                  {ProfileData?.first_name + ' ' + ProfileData?.last_name}
                </Text>
              )}

              <View style={styles.ImageProfileView}>
                <View style={styles.ImageBox}>
                  {ProfileData?.logo_link ? (
                    <Image
                      source={{uri: ProfileData?.logo_link}}
                      resizeMode="cover"
                      style={{
                        height: verticalScale(100),
                        width: verticalScale(140),
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.red,
                      }}
                      onLoadStart={() => setImageLoader(true)}
                      onLoadEnd={() => setImageLoader(false)}></Image>
                  ) : (
                    <Image
                      source={{
                        uri: 'https://admin.sheshalaw.co.za/public/img/logo.jpg',
                      }}
                      resizeMode="cover"
                      style={{
                        height: verticalScale(100),
                        width: verticalScale(140),
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.colorGray,
                      }}
                      onLoadStart={() => setImageLoader(true)}
                      onLoadEnd={() => setImageLoader(false)}></Image>
                  )}
                  {/* {imageLoader && (
                    <ActivityIndicator
                      style={{alignSelf: 'center'}}
                      size={'small'}
                      color={colors.colorWhite}
                    />
                  )} */}
                  {/* {!ProfileData?.logo_link && (
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: 'bold',
                        color: colors.colorBlack,
                      }}>
                      {'IMAGE'}
                    </Text>
                  )} */}
                </View>
                {ProfileData && (
                  <View>
                    <Text style={[styles.FullName]}>{'Name'}</Text>
                    <Text style={styles.shortName}>
                      {ProfileData?.first_name + ' ' + ProfileData?.last_name}
                    </Text>

                    {ProfileData?.nick_name && (
                      <>
                        <Text style={[styles.FullName]}>{'Nickname'}</Text>
                        <Text style={styles.shortName}>
                          {ProfileData?.nick_name}
                        </Text>
                      </>
                    )}
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Text style={[styles.FullName]}>{'Mobile No'}</Text>
                        <Text style={styles.shortName}>
                          {ProfileData?.contact_number}
                        </Text>
                      </View>
                      {/* <View>
                        {Terminated !== i18n.TerminatedEmploy && (
                          <View>
                            <Text style={[styles.FullName]}>{'Leave'}</Text>
                            <Text style={styles.shortName}>
                              {ProfileData?.paid_leave_days}
                            </Text>
                          </View>
                        )}
                      </View> */}
                    </View>
                  </View>
                )}
              </View>
              {/* <View style={{flexDirection: 'row'}}>
                {ProfileData?.email && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Email'}</Text>
                    <Text style={[styles.shortName]}>{ProfileData?.email}</Text>
                  </View>
                )}
                {ProfileData?.contact_person_name && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>
                      {'Contact person name'}
                    </Text>
                    <Text style={styles.shortName}>
                      {ProfileData?.contact_person_name}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{flexDirection: 'row', marginTop: 10}}>
                {ProfileData?.contact_person_number && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>
                      {'Contact person number'}
                    </Text>
                    <Text style={styles.shortName}>
                      {ProfileData?.contact_person_number}
                    </Text>
                  </View>
                )}
                {ProfileData?.company_name && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Company name'}</Text>
                    <Text style={styles.shortName}>
                      {ProfileData?.company_name}
                    </Text>
                  </View>
                )}
              </View> */}
              <View>
                <TouchableOpacity
                  style={{flexDirection: 'row', justifyContent: 'center'}}
                  onPress={() => {
                    setIsDropFlag(!isDropFlag);
                  }}>
                  <Text style={[styles.HText]}>{'Other Details'}</Text>
                  <Image
                    source={images.DropDown}
                    style={[
                      styles.SideImage,
                      {marginLeft: 30, top: 2},
                      isDropFlag && {transform: [{rotate: '180deg'}]},
                    ]}
                  />
                </TouchableOpacity>

                {OtherData && isDropFlag && (
                  <FlatList
                    data={OtherData}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={true}
                    renderItem={({item, index}) => {
                      if (item?.body != null) {
                        return (
                          <View style={{flex: 1, marginTop: 4}}>
                            {item?.title !== 'Job Duties' && (
                              <>
                                <Text style={[styles.FullName]}>
                                  {item?.title}
                                </Text>
                                <Text style={styles.shortName}>
                                  {item?.body}
                                </Text>
                              </>
                            )}
                            {item?.title == 'Job Duties' && (
                              <>
                                <TouchableOpacity
                                  style={{
                                    flexDirection: 'row',
                                  }}
                                  onPress={() => {
                                    jpbDutiesFlag(item, index);
                                  }}>
                                  <Text style={[styles.FullName]}>
                                    {item?.title}
                                  </Text>
                                  <Image
                                    source={images.DropDown}
                                    style={[
                                      {
                                        marginLeft: 10,
                                        marginTop: 5,
                                        height: verticalScale(10),
                                        width: verticalScale(10),
                                      },
                                      item?.isDutiesOpen && {
                                        transform: [{rotate: '180deg'}],
                                      },
                                    ]}
                                  />
                                </TouchableOpacity>
                                {item?.isDutiesOpen && (
                                  <Text style={styles.shortName}>
                                    {item?.body}
                                  </Text>
                                )}
                              </>
                            )}
                          </View>
                        );
                      }
                    }}
                  />
                )}
                {/* <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.job_details?.job_title && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Job title'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.job_details?.job_title}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.job_details?.job_duties && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Job Duties'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.job_details?.job_duties}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.bank_Details?.UIF_reference_number && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>
                        {'UIF reference number'}
                      </Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.bank_Details?.UIF_reference_number}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.bank_Details?.bank_name && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Bank name'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.bank_Details?.bank_name}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.bank_Details?.account_number && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Account number'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.bank_Details?.account_number}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.bank_Details?.account_type && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Account type'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.bank_Details?.account_type}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.bank_Details?.holder_name && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Holder name'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.bank_Details?.holder_name}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.email && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Email'}</Text>
                      <Text style={styles.shortName}>{ProfileData?.email}</Text>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.physical_address && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>
                        {'Physical address'}
                      </Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.physical_address}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.created_at && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>
                        {'Employee start date'}
                      </Text>
                      <Text style={styles.shortName}>
                        {moment(ProfileData?.created_at).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.contact_person_name && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>
                        {'Contact person name'}
                      </Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.contact_person_name}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.contact_person_number && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>
                        {'Contact person number'}
                      </Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.contact_person_number}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{flexDirection: 'row', marginTop: 4}}>
                  {ProfileData?.salary?.salary && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Salary'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.salary?.salary}
                      </Text>
                    </View>
                  )}
                  {ProfileData?.job_details?.pattern_of_work && (
                    <View style={{flex: 1}}>
                      <Text style={[styles.FullName]}>{'Pattern of work'}</Text>
                      <Text style={styles.shortName}>
                        {ProfileData?.job_details?.pattern_of_work}
                      </Text>
                    </View>
                  )}
                </View> */}
              </View>

              <CommonButton
                Title={'DOWNLOADS'}
                OnPress={() => onButtonPress(i18n.Files)}
              />
              <CommonButton
                Title={i18n.PaySlip}
                OnPress={() => onButtonPress(i18n.PaySlip)}
              />
              <CommonButton
                Title={'LEAVE SUMMARY'}
                OnPress={() => onButtonPress(i18n.Leave)}
              />
              {Terminated !== i18n.TerminatedEmploy && (
                <CommonButton
                  Title={i18n.AddLeave}
                  OnPress={() => {
                    NavigationService.navigate(ScreenName.LeaveType, {
                      employeeData: ProfileData,
                    });
                  }}
                />
              )}
              {Terminated !== i18n.TerminatedEmploy && (
                <CommonButton
                  Title={'DELETE PROFILE'}
                  OnPress={() => {
                    AlertBox({
                      Title: 'Are you sure?',
                      Message:
                        'You are about to delete this Employee’s profile completely. We only recommend this if you have entered the wrong information and are wishing to re-add the Employee. If the Employee no longer works for you we recommend clicking and following the steps for “Terminate Employee”',
                      ButtonTitle: 'Yes I am sure',
                      CancelTitle: 'No go back',
                      isCancelAvailable : true,
                      onOkPress: () => {
                        DeleteProfile();
                      },
                      onCancelPress: () => {},
                    });
                  }}
                />
              )}
              {Terminated !== i18n.TerminatedEmploy && (
                <CommonButton
                  Title={i18n.EditProfile}
                  OnPress={() => {
                    NavigationService.navigate(ScreenName.EditEmployeeProfile, {
                      employeeData: ProfileData,
                    });
                  }}
                />
              )}
              {Terminated !== i18n.TerminatedEmploy && (
                <CommonButton
                  Title={i18n.Terminate}
                  TitleStyle={styles.ButtonTitle}
                  ViewStyle={styles.ViewStyle}
                  OnPress={() => onButtonPress(i18n.Terminate)}
                />
              )}
              <CommonButton
                Title={i18n.Back}
                OnPress={() => onButtonPress(i18n.Back)}
              />
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
  M1: {
    marginTop: moderateVerticalScale(40),
  },
  ImageProfileView: {
    flexDirection: 'row',
    marginBottom: moderateVerticalScale(20),
  },
  ImageBox: {
    height: verticalScale(100),
    width: verticalScale(140),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.colorGray,
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FullName: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: colors.colorGray,
    letterSpacing: 0.5,
    // alignSelf: 'center',
    marginLeft: moderateVerticalScale(12),
  },
  shortName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.colorBlack,
    letterSpacing: 0.5,
    // alignSelf: 'center',
    marginLeft: moderateVerticalScale(12),
  },
  ViewStyle: {
    backgroundColor: colors.colorRed,
  },
  HText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(10),
    color: colors.colorBlack,
  },
  ButtonTitle: {
    color: colors.colorWhite,
  },
  SideImage: {
    height: verticalScale(20),
    width: verticalScale(20),
  },
});

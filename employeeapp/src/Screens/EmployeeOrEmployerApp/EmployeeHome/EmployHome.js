import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {useSelector} from 'react-redux';
import {userOfData} from '../../../ReduxConfig/Slice/UserDataSlice';
import moment from 'moment';
import images from '../../../themes/images';

export default function EmployHome() {
  //USE_SELECTOR
  const DATA_OF_EMPLOYEE = useSelector(userOfData);
  const Employee_Data = DATA_OF_EMPLOYEE?.payload?.UserData?.data;

  const [OtherData, setOtherData] = useState(undefined);
  const [isDropFlag, setIsDropFlag] = useState(false);

  //onButtonPress
  const onButtonPress = Type => {
    console.log(Type);
    if (i18n.Files === Type) {
      NavigationService.navigate(ScreenName.FileScreen, {
        color: colors.Blue,
        employee_id: Employee_Data,
        name: i18n.Files,
        isDelete: false,
      });
    }
    if (i18n.PaySlip === Type) {
      NavigationService.navigate(ScreenName.PaySlipView, {
        color: colors.colorRed,
        employee_id: Employee_Data,
        name: i18n.PaySlip,
      });
    }
    if (i18n.Leave === Type) {
      NavigationService.navigate(ScreenName.DaysLeave, {
        color: colors.green1,
        employee_id: Employee_Data?.id,
      });
    }
    if (i18n.ChangePassword == Type) {
      NavigationService.navigate(ScreenName.ForgotPassword);
    }
    if (i18n.Logout == Type) {
      NavigationService.navigate(ScreenName.LogOut, {color: colors.yellow});
    }
    if (i18n.Notification == Type) {
      NavigationService.navigate(ScreenName.NotificationView);
    }
  };
  useEffect(() => {
    makeOtherDetailsArray();
  }, []);
  const makeOtherDetailsArray = () => {
    const otherDataArray = [
      {
        title: 'Job title',
        body: Employee_Data?.job_details?.job_title,
      },
      {
        title: 'Job Duties',
        body: Employee_Data?.job_details?.job_duties,
      },
      {
        title: 'UIF reference number',
        body: Employee_Data?.bank_Details?.UIF_reference_number,
      },
      {
        title: 'Bank name',
        body: Employee_Data?.bank_Details?.bank_name,
      },
      {
        title: 'Account number',
        body: Employee_Data?.bank_Details?.account_number,
      },
      {
        title: 'Account type',
        body: Employee_Data?.bank_Details?.account_type,
      },
      {
        title: 'Bank account holder name',
        body: Employee_Data?.bank_Details?.holder_name,
      },
      {
        title: 'Email',
        body: Employee_Data?.email,
      },
      {
        title: 'Physical address',
        body: Employee_Data?.physical_address,
      },
      {
        title: 'Employee start date',
        body: Employee_Data?.job_details?.employment_start_date,
      },
      {
        title: 'Emergency contact person name',
        body: Employee_Data?.contact_person_name,
      },
      {
        title: 'Emergency contact person number',
        body: Employee_Data?.contact_person_number,
      },
      {
        title: 'Salary',
        body: Employee_Data?.salary,
      },
      {
        title: 'Pattern of work',
        body: Employee_Data?.job_details?.pattern_of_work,
      },
    ];
    console.log('====================================');
    console.log(otherDataArray);
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
      BackgroundColor={colors.yellow}
      Container={() => {
        return (
          <View style={styles.Container}>
            <CommonLogo />
            <ScrollView
              style={styles.M1}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <View style={styles.ImageProfileView}>
                <View
                  style={[
                    styles.ImageBox,
                    Employee_Data?.logo_link == null && {
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}>
                  {Employee_Data?.logo_link != null ? (
                    <Image
                      source={{uri: Employee_Data?.logo_link}}
                      style={{
                        height: verticalScale(100),
                        width: verticalScale(140),
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={{
                        uri: 'https://admin.sheshalaw.co.za/public/img/logo.jpg',
                      }}
                      style={{
                        height: verticalScale(100),
                        width: verticalScale(140),
                      }}
                      resizeMode="cover"
                    />
                  )}
                  {/* {Employee_Data?.logo_link == null && (
                    <Text
                      style={{
                        fontSize: moderateScale(14),
                        fontWeight: '800',
                        color: colors.colorBlack,
                        alignSelf: 'center',
                      }}>
                      {'IMAGE'}
                    </Text>
                  )} */}
                </View>
                <View>
                  <Text style={[styles.FullName]}>{'Name'}</Text>
                  <Text style={styles.shortName}>
                    {Employee_Data?.full_name}
                  </Text>

                  {Employee_Data?.nick_name && (
                    <>
                      <Text style={[styles.FullName]}>{'Nickname'}</Text>
                      <Text style={styles.shortName}>
                        {Employee_Data?.nick_name}
                      </Text>
                    </>
                  )}
                  <View style={{flexDirection: 'row'}}>
                    <View>
                      <Text style={[styles.FullName]}>{'Mobile No'}</Text>
                      <Text style={styles.shortName}>
                        {Employee_Data?.contact_number}
                      </Text>
                    </View>

                    {/* <View>
                      <Text style={[styles.FullName]}>{'Leave'}</Text>
                      <Text style={styles.shortName}>
                        {Employee_Data?.paid_leave_days}
                      </Text>
                    </View> */}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={{flexDirection: 'row', justifyContent: 'center'}}
                onPress={() => {
                  setIsDropFlag(!isDropFlag);
                }}>
                <Text style={[styles.HText]}>{'Other Details'}</Text>
                <Image
                  source={images.DropDown}
                  style={[
                    {
                      marginLeft: 30,
                      top: 2,
                      height: verticalScale(20),
                      width: verticalScale(20),
                    },
                    isDropFlag && {transform: [{rotate: '180deg'}]},
                  ]}
                />
              </TouchableOpacity>
              {OtherData && isDropFlag && (
                <FlatList
                  data={OtherData}
                  keyExtractor={(item, index) => index}
                  renderItem={({item, index}) => {
                    if (item?.body != null) {
                      return (
                        <View style={{flex: 1, marginTop: 4}}>
                          {item?.title !== 'Job Duties' && (
                            <>
                              <Text style={[styles.FullName]}>
                                {item?.title}
                              </Text>
                              <Text style={styles.shortName}>{item?.body}</Text>
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
              {/* <Text style={[styles.HText]}>{'Other Details'}</Text>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {Employee_Data?.bank_Details?.UIF_reference_number && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>
                      {'UIF reference number'}
                    </Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.bank_Details?.UIF_reference_number}
                    </Text>
                  </View>
                )}
                {Employee_Data?.bank_Details?.bank_name && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Bank_name'}</Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.bank_Details?.bank_name}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {Employee_Data?.bank_Details?.account_number && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Account number'}</Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.bank_Details?.account_number}
                    </Text>
                  </View>
                )}
                {Employee_Data?.bank_Details?.account_type && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Account type'}</Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.bank_Details?.account_type}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {Employee_Data?.bank_Details?.holder_name && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Holder name'}</Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.bank_Details?.holder_name}
                    </Text>
                  </View>
                )}
                {Employee_Data?.email && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Email'}</Text>
                    <Text style={styles.shortName}>{Employee_Data?.email}</Text>
                  </View>
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {Employee_Data?.physical_address && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>{'Physical address'}</Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.physical_address}
                    </Text>
                  </View>
                )}
                {Employee_Data?.created_at && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>
                      {'Employee start date'}
                    </Text>
                    <Text style={styles.shortName}>
                      {moment(Employee_Data?.created_at).format('DD/MM/YYYY')}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {Employee_Data?.contact_person_name && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>
                      {'Contact person name'}
                    </Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.contact_person_name}
                    </Text>
                  </View>
                )}
                {Employee_Data?.contact_person_number && (
                  <View style={{flex: 1}}>
                    <Text style={[styles.FullName]}>
                      {'Contact person number'}
                    </Text>
                    <Text style={styles.shortName}>
                      {Employee_Data?.contact_person_number}
                    </Text>
                  </View>
                )}
              </View> */}
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
              <CommonButton
                Title={i18n.Notification}
                OnPress={() => onButtonPress(i18n.Notification)}
              />
              <CommonButton
                Title={i18n.ChangePassword}
                OnPress={() => onButtonPress(i18n.ChangePassword)}
              />
              <CommonButton
                Title={i18n.Logout}
                OnPress={() => onButtonPress(i18n.Logout)}
              />
            </ScrollView>
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
  HText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: moderateScale(10),
    color: colors.colorBlack,
  },
});

import React, {Component, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from 'react-native-size-matters';
import {colors} from '../../../themes';
import images from '../../../themes/images';

export default function JobTitle({
  OnPress,
  Title,
  ArrayOfTitle,
  onTitleSelect,
}) {
  //State
  const [isSelect, setIsSelect] = useState(false);
  const [TitleofSelect, setTitle] = useState(Title);

  //showTitle
  const showTitle = (item, index) => {
    return (
      <TouchableOpacity
      key={index}
        style={[styles.boxOfTitle]}
        onPress={() => {
          onTitleSelect && onTitleSelect(item?.title);
          setTitle(item?.title);
          setIsSelect(!isSelect);
        }}>
        <Text>{item?.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
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
        style={styles.gradient}>
        <View style={{flex: 1.0}}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setIsSelect(!isSelect);
            }}>
            <Text style={styles.buttonText}>{TitleofSelect}</Text>
            <Image
              source={images.DropDown}
              style={[
                styles.SideImage,
                isSelect && {transform: [{rotate: '180deg'}]},
              ]}
            />
          </TouchableOpacity>
          {isSelect && ArrayOfTitle && (
            <View style={styles.FlashBox}>
              <FlatList
                data={ArrayOfTitle}
                key={(item, index) => index}
                renderItem={({item, index}) => showTitle(item, index)}
                showsVerticalScrollIndicator={false}
                bounces={false}
              />
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    minHeight: verticalScale(40),
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: moderateScale(10),
    margin: moderateScale(10),
  },
  buttonContainer: {
    height: verticalScale(40),
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    width: '98%',
    margin: moderateScale(2),
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateVerticalScale(10),
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
    color: colors.colorBlack,
    alignSelf: 'center',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  SideImage: {
    height: verticalScale(20),
    width: verticalScale(20),
  },
  FlashBox: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    width: '98%',
    margin: moderateScale(2),
    paddingHorizontal: moderateVerticalScale(10),
  },
  boxOfTitle: {
    height: verticalScale(36),
    width: '96%',
    borderRadius: moderateScale(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: moderateVerticalScale(6),
    marginBottom: moderateVerticalScale(6),
    borderWidth: moderateScale(0.5),
    borderColor: colors.colorGray,
  },
});

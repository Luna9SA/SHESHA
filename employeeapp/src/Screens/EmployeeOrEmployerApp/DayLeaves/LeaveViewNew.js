import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Images from '../../../themes/images';
import {colors} from '../../../themes';

export default function LeaveViewNew({Array, onPress, isPayList}) {
  //showDocuments
  const showDocuments = (item, index) => {
    console.log('ITEM ::: ', item);
    return (
      <View style={styles.DocumentView}>
        <Text style={styles.HText}>
          {item?.reason + ' - ' + item?.leave_type}
        </Text>
        <TouchableOpacity
          onPress={() => onPress && onPress(item)}
          style={{
            borderWidth: 1,
            borderColor: colors.colorGray,
            borderRadius: 8,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 4,
            paddingBottom: 4,
            marginBottom: 6,
            marginTop: 6,
          }}>
          <Text>Select</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.Container}>
      <LinearGradient
        style={styles.TopLiner}
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
      />
      <View style={styles.MiddleView}>
        <FlatList
          data={Array}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => showDocuments(item, index)}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </View>
      <LinearGradient
        style={styles.TopLiner}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    // height: verticalScale(300),
    justifyContent: 'space-between',
  },
  TopLiner: {
    height: verticalScale(2),
  },
  MiddleView: {
    flex: 1.0,
    backgroundColor: 'white',
  },
  DocumentView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(5),
    marginBottom: moderateScale(5),
  },
  HText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: colors.lightBlack,
    width: '70%',
  },
});

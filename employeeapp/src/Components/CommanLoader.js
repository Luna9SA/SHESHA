import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {colors} from '../themes';

export default function CommanLoader({isVisible}) {
  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.Container}>
        <ActivityIndicator
          size={'large'}
          color={colors.colorBlack}
          style={{alignSelf: 'center'}}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

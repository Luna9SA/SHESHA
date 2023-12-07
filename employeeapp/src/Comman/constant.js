import {Buffer} from 'buffer';
import {Alert} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

// response code for check from bakand side
export const responseCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BED_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIME_OUT: 408,
  UNPROCESSED_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BED_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATE_WAY_TIMEOUT: 504,
  NETWORK_AUTH_REQUIRED: 511,
};

export const decodeBase64 = value => {
  return Buffer.from(value, 'base64').toString('ascii');
};

export function AlertBox({
  onOkPress,
  onCancelPress,
  isCancelAvailable,
  Title,
  Message,
  ButtonTitle,
  CancelTitle,
}) {
  return isCancelAvailable
    ? Alert.alert(Title, Message, [
        {
          text: CancelTitle ? CancelTitle : 'Cancel',
          onPress: () => {
            onCancelPress ? (onCancelPress && onCancelPress()) : {};
          },
        },
        {
          text: ButtonTitle ? ButtonTitle : 'OK',
          onPress: () => onOkPress && onOkPress(),
        },
      ])
    : Alert.alert(Title, Message, [
        {
          text: ButtonTitle ? ButtonTitle : 'OK',
          onPress: () => onOkPress && onOkPress(),
        },
      ]);
}
export const netWorkCheck = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export const onSearchAddress = async t => {
  const apiUrl = `${'https://maps.googleapis.com/maps/api/place'}/autocomplete/json?key=${'AIzaSyBkLAhns9F59_qwHWM4JI7jg9ILISKoNeU'}&input=${t}`;
  try {
    const result = await axios.request({
      method: 'post',
      url: apiUrl
    })
    if (result) {
      const { data: { predictions } } = result
      return predictions;
    }
  } catch (e) {
    return e;
    console.log(e)
  }
};

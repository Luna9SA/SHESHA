import axios from 'axios';
import {LOGIN} from '../Apis/Api';
import {AlertBox, responseCodes} from '../Comman/constant';
import i18n from '../themes/i18n';
import NavigationService from '../Navigation/NavigationService';
import {ScreenName} from '../Navigation/ScreenName';

/*
  you can set your Header config. as well your backend side needed.
  this is normal default header config.
*/

//Normal_Post
export const Post_Api = async (Url, params) => {
  return await fetch(
    Url,
    params
      ? {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${global.AccessToken}`,
          },
          body: JSON.stringify(params),
        }
      : {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${global.AccessToken}`,
          },
        },
  )
    .then(response => response.json())
    .then(json => {
      console.log('URL :::', Url);
      console.log("TOken : " , global.AccessToken);
      console.log('dsdadasdas', json);
      const JsonData = checkOfResponseValidation(json);
      console.log('JsonData', JsonData);
      return JsonData;
    })
    .catch(error => {
      AlertBox({Title: i18n.Alert, Message: error.toString() + '!'});
      return error;
    });
};

//Form_Data_Post
export const Post_Form_Data_Api = async (Url, params) => {
  return await fetch(Url, {
    method: 'POST',
    headers: {
      // Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${global.AccessToken}`,
    },
    body: params,
  })
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
      const JsonData = checkOfResponseValidation(json);
      console.log('JsonData', JsonData);
      return JsonData;
    })
    .catch(error => {
      AlertBox({Title: i18n.Alert, Message: error.toString() + '!'});
      return error;
    });
};

//Normal_Get
export const Get_Api = async (Url, params) => {
  return await fetch(Url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${global.AccessToken}`,
    },
  })
    .then(response => response.json())
    .then(json => {
      const JsonData = checkOfResponseValidation(json);
      Promise.resolve(JsonData);
    })
    .catch(error => {
      AlertBox({Title: i18n.Alert, Message: 'Something Went Wrong!'});
      Promise.reject(error);
    });
};

//check All Validation of API
const checkOfResponseValidation = response => {
  if (response?.status_code === responseCodes.OK) {
    return response;
  } else if (response?.status_code === responseCodes.UNAUTHORIZED) {
    AlertBox({
      Title: i18n.Alert,
      Message: response?.message,
      onOkPress: () => {
        global.isAuthorized = true;
        NavigationService.resetAndRedirect(ScreenName.Welcome);
      },
    });
  } else {
    AlertBox({Title: i18n.Alert, Message: response?.message});
  }
};

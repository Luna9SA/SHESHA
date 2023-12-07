import {CommonActions, StackActions} from '@react-navigation/native';
let _navigator;

/**
 * @function setTopLevelNavigator
 * @param {*} navigatorRef
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

/**
 * @function resetAndRedirect
 * @param {*} routeName
 */
function resetAndRedirect(routeName) {
  _navigator.reset({
    routes: [{name: routeName}],
  });
}

/**
 * @function navigate
 * @param {*} routeName
 * @param {*} params
 */
function navigate(routeName, params) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    }),
  );
}

/**
 * @function goBack
 */
function goBack() {
  _navigator.dispatch(StackActions.pop());
}

export default {
  navigate,
  goBack,
  setTopLevelNavigator,
  resetAndRedirect,
};

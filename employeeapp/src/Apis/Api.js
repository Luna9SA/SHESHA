// BASE URL
export const BASE_URL = 'https://admin.sheshalaw.co.za/api';

//EMPLOYER
export const EMPLOYER = '/employer/';

//EMPLOYER AUTH
export const EMPLOYER_LOGIN = BASE_URL + EMPLOYER + 'login';
export const EMPLOYER_REGISTER = BASE_URL + EMPLOYER + 'register';
export const EMPLOYER_FORGOT_PASSWORD = BASE_URL + EMPLOYER + 'forgot-password';
export const EMPLOYEE_FORGOT_PASSWORD = BASE_URL + '/employee/forgot-password';
export const EMPLOYER_OTP_VERIFY = BASE_URL + EMPLOYER + 'verify-otp';
export const EMPLOYEE_OTP_VERIFY = BASE_URL + '/employee/verify-otp';
export const EMPLOYER_RESET_PASSWORD = BASE_URL + EMPLOYER + 'reset-password';
export const EMPLOYEE_RESET_PASSWORD = BASE_URL + '/employee/reset-password';
export const EMPLOYER_LOGOUT = BASE_URL + EMPLOYER + 'logout';
export const EMPLOYER_ADD_NEW_EMPLOYEE =
  BASE_URL + EMPLOYER + 'create/employee';
export const EMPLOYER_TITLE = BASE_URL + '/job/title';
export const EMPLOYER_DUTIES = BASE_URL + '/job/duties';
export const EMPLOYER_EMPLOYEE_LIST = BASE_URL + '/employee/list';
export const EMPLOYER_TERMINATED_LIST = BASE_URL + '/employee/terminate/list';
export const EMPLOYEE_PROFILE = BASE_URL + '/employee/Profile';
export const EMPLOYEE_DUTIES = BASE_URL + '/employee/job-details/';

//EMPLOYEE
export const EMPLOYEE_LOGIN = BASE_URL + '/employee/login';
export const EMPLOYEE_First_Login = BASE_URL + '/employee/first-login';
export const EMPLOYEE_DELETE_ACCOUNT = BASE_URL + '/employer/delete-account';
export const EMPLOYER_PROFILE = BASE_URL + '/employer/profile';
export const EMPLOYER_PROFILE_UPDATE = BASE_URL + '/employer/profile/update';
export const EMPLOYER_PROFILE_TERMINATION = BASE_URL + '/employee/terminate';
export const EMPLOYER_FILES = BASE_URL + '/employee/files';
export const EMPLOYER_FILES_LIST = BASE_URL + '/employee/file/list';
export const EMPLOYER_PAYSLIP = BASE_URL + '/employee/payslip';
export const EMPLOYER_PAYSLIP_LIST = BASE_URL + '/employee/payslip/list';
export const EMPLOYER_SHARE = BASE_URL + '/employee/file/share';
export const EMPLOYER_SHARE_PAYSLIP = BASE_URL + '/employee/payslip/share';
export const DELETE_ACCOUNT = BASE_URL + '/employee/payslip/share';
export const DELETE_DOCUMENTS = BASE_URL + '/employee/delete/documents';
export const DAY_LEAVES = BASE_URL + '/employee/leave/days';
export const LOGO_ADD = BASE_URL + '/employee/logo';
export const NOTIFICATION_DATA = BASE_URL + '/notification/list';
export const READ_NOTIFICATION = BASE_URL + '/notification/read';
export const TERMS_ADN_CONDITION = BASE_URL + '/pages/content';
export const OTHER_DOCUMENT_ADD = BASE_URL + '/employee/other/file/documents';
export const ADD_LEAVE = BASE_URL + '/employee/leaves';
export const GET_STATIC_DATA = BASE_URL + '/bankdata';
export const UIF_NUMBERCALLED = BASE_URL + '/employee/uifnumber';
export const GET_ALL_LEAVE_TYPES = BASE_URL + '/employee/leavetype';
export const EDIT_LEAVE = BASE_URL + '/employee/leave/edit';
export const EMPLOYEE_VERIFY_API = BASE_URL + '/employee/check-email';
export const EMPLOYEE_PROFILE_UPDATE = BASE_URL + '/employee/profile/update';
export const EMPLOYEE_PROFILE_IMAGE_UPDATE = BASE_URL + '/employee/profile_image/update';
export const DELETE_PROFILE = BASE_URL +  '/employee/delete';

import i18n from '../themes/i18n';

const Email_Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const Phone_Regex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

//EMAIL VALIDATION
export function EmailValidation(text) {
  if (!text) {
    return i18n.EmailError;
  }
}

//MR/MRS VALIDATION
export function GenderTitleValidation(Text) {
  console.log('Text LL: ', Text);
  if (!Text) {
    return i18n.EmptyTitle;
  }
}

//FIRST VALIDATION
export function FirstNameValidation(Text) {
  if (!Text) {
    return i18n.EmptyFirstName;
  }
}

//Last VALIDATION
export function LastNameValidation(Text) {
  if (!Text) {
    return i18n.EmptyLastName;
  }
}

//Full Address VALIDATION
export function FullAddressValidation(Text) {
  if (!Text) {
    return i18n.EmptyFullAddress;
  }
}

//NUMBER VALIDATION
export function PhoneNumberValidation(Text) {
  if (!Text) {
    return i18n.EmptyPhone;
  } else if (!Phone_Regex.test(Text)) {
    return i18n.PhoneError;
  }
}

//PASSWORD VALIDATION
export function PassWordValidation(Text) {
  if (!Text) {
    return i18n.EmptyPassword;
  }
}

//CONFORM VALIDATION
export function ConformPasswordValidation(Text, Text1) {
  if (!Text) {
    return i18n.EmptyConformPassword;
  } else if (Text !== Text1) {
    return i18n.ConformPasswordError;
  }
}

export function IdNumberValidation(Text) {
  if (!Text) {
    return i18n.EmptyId;
  }
}

export function PhysicalAddressValidation(Text) {
  if (!Text) {
    return i18n.EmptyPhysicalAddress;
  }
}

export function BankNameValidation(Text) {
  if (!Text) {
    return i18n.EmptyBank;
  }
}

export function HolderValidation(Text) {
  if (!Text) {
    return i18n.EmptyHolderName;
  }
}

export function AccountNumberValidation(Text) {
  if (!Text) {
    return i18n.EmptyBankNumber;
  }
}

export function AccountTypeValidation(Text) {
  if (!Text) {
    return i18n.EmptyBankType;
  }
}

export function UIFValidation(Text) {
  if (!Text) {
    return i18n.EmptyUIF;
  }
}

export function ProfileImageValidation(Text) {
  if (!Text) {
    return i18n.EmptyImage;
  }
}

export function AlternateFullNameValidation(Text) {
  if (!Text) {
    return i18n.EmptyAlterNetName;
  }
}

export function AlternetPhoneNumeberValidation(Text) {
  if (!Text) {
    return i18n.EmptyAlterNetPhone;
  } else if (!Phone_Regex.test(Text)) {
    return i18n.PhoneError;
  }
}

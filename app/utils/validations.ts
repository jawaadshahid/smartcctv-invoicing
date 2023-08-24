export const validateTel = (tel: string) => {
  if (!tel) {
    return "Tel is Required!";
  } else if (!/^[0][1-9]\d{9}$|^[1-9]\d{9}$/.test(tel)) {
    return "Invalid tel, needs to be a 11 digit number!";
  }
};

export const validateName = (name: string) => {
  if (!name) {
    return "Name is Required!";
  } else if (!/^[a-z A-Z]+$/.test(name)) {
    return "Invalid name!";
  }
};

export const validateFname = (firstname: string) => {
  if (!firstname) {
    return "First name is Required!";
  } else if (!/^[a-zA-Z]+$/.test(firstname)) {
    return "Invalid First name!";
  }
};

export const validateLname = (lastname: string) => {
  if (!lastname) {
    return "Last name is Required!";
  } else if (!/^[a-zA-Z]+$/.test(lastname)) {
    return "Invalid Last name!";
  }
};

export const validateEmail = (email: string) => {
  if (!email) {
    return "Email is Required!";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    return "Invalid emaill!";
  }
};

export const validatePassword = (password: string) => {
  if (!password) {
    return "Password is Required!";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return "Weak password! A strong password should contain atleast 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.";
  }
};

export const validateCustomerData = ({ name, tel, email, address }: any) => {
  const errors: any = {};
  errors.name = validateName(`${name}`);
  if (!address && !tel && (!email || `${email}` === "sunny@smartcctvuk.co.uk"))
    errors.info = "come on bro, capture some contact info!";
  return errors;
};

export const validateProductData = ({
  brand,
  newbrand,
  type,
  newtype,
  model,
  newmodel,
  price,
}: any) => {
  const errors: any = {};
  const isBrandSelected = brand && parseInt(`${brand}`) > 0;
  const isTypeSelected = type && parseInt(`${type}`) > 0;
  const isModelSelected = model && parseInt(`${model}`) > 0;
  if (!isBrandSelected && !newbrand) {
    errors.brand = "a brand must be selected or defined";
  }
  if (!isTypeSelected && !newtype) {
    errors.type = "a type must be selected or defined";
  }
  if (!isModelSelected && !newmodel) {
    errors.model = "a model must be selected or defined";
  }
  if (!price || Number(price) <= 0) {
    errors.price = "a valid price must be defined";
  }
  return errors;
};

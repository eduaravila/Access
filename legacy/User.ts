import validator from "validator";

import {
  registerType,
  varifyAccountType,
  loginType,
  restorePasswordSetNewType
} from "../src/controllers/types";
import pre_user_model from "../src/models/User/PreUser";
import Jwt from "../src/utils/jwt";
import user_model from "../src/models/User/User";

interface invalidInputsType {
  value: string;
  error: string;
  key: string;
}

interface validationType {
  [any: string]: { validation: boolean; error: string }[];
}

const check_inputs = async (validations: validationType, props: any) => {
  let invalidInputs: invalidInputsType[] = [];

  try {
    let inputs = Object.keys(validations);

    inputs.map(async (i: string) => {
      await Promise.all(
        validations[i].map(e => {
          if (!e.validation) {
            if (props.hasOwnProperty(i)) {
              invalidInputs = [
                ...invalidInputs,
                { value: props[i], error: e.error, key: i }
              ];
            }
          }
          return e;
        })
      );
    });
    if (invalidInputs.length > 0) {
      return Promise.reject(invalidInputs);
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const registerValidation = async (props: registerType) => {
  let { username, password, email } = props;

  try {
    let validations: validationType = {
      email: [
        { validation: validator.isEmail(email), error: "Invalid email" },
        {
          validation: await pre_user_model.check_email_availability(email),
          error: "Email already registered"
        }
      ],
      username: [
        {
          validation: validator.isLength(username, { min: 1, max: 20 }),
          error: "Invalid username, should be length < 1 & < 20"
        },
        {
          validation: !(await pre_user_model.user_exist(username)),
          error: "Invalid username, is already taked"
        }
      ],
      password: [
        {
          validation: validator.matches(
            password,
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
          ),
          error:
            "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
        }
      ]
    };
    let result = await check_inputs(validations, props);

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const verifyAccountValidation = async (props: varifyAccountType) => {
  let { code, token } = props;

  try {
    let validations: validationType = {
      code: [
        {
          validation: validator.isLength(code, { min: 6, max: 6 }),
          error: "Invalid validation code"
        }
      ],
      token: [
        {
          validation: validator.isJWT(token),
          error: "Invalid validation code"
        }
      ]
    };
    let result = await check_inputs(validations, props);

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};

// ? the user is in the pre user table or if the user is already registed then throw an error
export const resendVerifyCodeValidation = async (props: {
  username: string;
}) => {
  let { username } = props;

  try {
    let validations: validationType = {
      username: [
        {
          validation: await pre_user_model.user_exist(username),
          error: "We can't send a code to this invalid user"
        }
      ]
    };
    let result = await check_inputs(validations, props);

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loginValidation = async (props: loginType) => {
  let { user, password } = props;

  try {
    let validations: validationType = {
      user: [
        {
          validation: await user_model.user_or_email_registered(user),
          error: "User | email is not registered!"
        }
      ],
      password: [
        {
          validation: await user_model.checkPassword(user, password),
          error: "Invalid password!"
        }
      ]
    };
    let result = await check_inputs(validations, props);

    return Promise.resolve(result);
  } catch (error) {
    console.log(error);

    return Promise.reject(error);
  }
};

export const restorePasswordCodeValidation = async (props: {
  email: string;
}) => {
  let { email } = props;

  try {
    let validations: validationType = {
      email: [
        {
          validation: validator.isEmail(email),
          error: "Invalid email!"
        },
        {
          validation: await user_model.email_is_registered(email),
          error: "Email is not registered!"
        }
      ]
    };
    let result = await check_inputs(validations, props);

    return Promise.resolve(result);
  } catch (error) {
    console.log(error);

    return Promise.reject(error);
  }
};

export const restorePasswordSetNewValidation = async (
  props: restorePasswordSetNewType
) => {
  let { code, token, password } = props;

  try {
    let validations: validationType = {
      code: [
        {
          validation: validator.isLength(code, { min: 6, max: 6 }),
          error: "Invalid validation code"
        }
      ],
      token: [
        {
          validation: validator.isJWT(token),
          error: "Invalid validation code"
        }
      ],
      password: [
        {
          validation: validator.matches(
            password,
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
          ),
          error:
            "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
        }
      ]
    };
    let result = await check_inputs(validations, props);

    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
};

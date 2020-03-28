import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import preUserModel from "../../models/User/PreUser";
import UserModel from "../../models/User/User";

import { ApolloError } from "apollo-server-express";

@ValidatorConstraint({ async: true })
export class EmailIsAvailableConstraint
  implements ValidatorConstraintInterface {
  async validate(email: any, args: ValidationArguments) {
    try {
      let user = await UserModel.check_email_availability(email);
      console.log(user);

      if (!user) {
        return Promise.reject(false);
      }
      await preUserModel.check_email_availability(email);
      return Promise.resolve(true);
    } catch (error) {
      throw new ApolloError(error);
    }
  }
}

export const IsEmailAvailable = (validationOpts: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOpts,
      constraints: [],
      validator: EmailIsAvailableConstraint
    });
  };
};

@ValidatorConstraint({ async: true })
export class UserIsAvailableConstraint implements ValidatorConstraintInterface {
  validate(user: any, args: ValidationArguments) {
    return preUserModel
      .user_exist(user)
      .then(e => !e)
      .catch(e => {
        throw e;
      });
  }
}

export const IsUserAvailable = (validationOpts: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOpts,
      constraints: [],
      validator: UserIsAvailableConstraint
    });
  };
};

@ValidatorConstraint({ async: true })
export class PreUserIsRegisteredConstraint
  implements ValidatorConstraintInterface {
  validate(user: any, args: ValidationArguments) {
    return preUserModel
      .user_exist(user)
      .then(e => e)
      .catch(e => {
        throw e;
      });
  }
}

export const PreUserIsRegistered = (validationOpts: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOpts,
      constraints: [],
      validator: PreUserIsRegisteredConstraint
    });
  };
};

@ValidatorConstraint({ async: true })
export class UserIsRegisteredConstraint
  implements ValidatorConstraintInterface {
  validate(user: any, args: ValidationArguments) {
    return UserModel.user_or_email_registered(user)
      .then(e => e)
      .catch(e => {
        throw e;
      });
  }
}

export const UserIsRegistered = (validationOpts: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOpts,
      constraints: [],
      validator: UserIsRegisteredConstraint
    });
  };
};

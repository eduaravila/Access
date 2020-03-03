import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";

import preUserModel from "../../models/User/PreUser";
import UserModel from "../../models/User/User";

@ValidatorConstraint({ async: true })
export class EmailIsAvailableConstraint
  implements ValidatorConstraintInterface {
  validate(email: any, args: ValidationArguments) {
    return preUserModel
      .check_email_availability(email)
      .then(e => e)
      .catch(e => {
        throw e;
      });
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

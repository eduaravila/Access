import {
  register,
  verifyAccount,
  resendVerifyCode,
  login,
  restorePasswordCode,
  restorePasswordCompareCode,
  restorePasswordSetNew
} from "../../src/controllers/User";
import {
  UserInputError,
  ApolloError,
  AuthenticationError
} from "apollo-server-express";

export const resolvers = {
  Mutation: {
    RegisterUser: async (_: any, data: any, context: any) => {
      try {
        let { userInfo } = data;
        let { req } = context;
        let msg = await register({ ...userInfo }, req);
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        console.log(error);

        throw new UserInputError("Some error with your inputs", { ...error });
      }
    },
    VerifyAccount: async (_: any, data: any, context: any) => {
      try {
        let { accountInfo } = data;
        let { req } = context;
        let msg = await verifyAccount({ ...accountInfo }, req);
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        if (error == "INVALID-CODE") {
          throw new AuthenticationError(error);
        }
        throw new UserInputError("Some error with your inputs", { ...error });
      }
    },
    RestorePasswordSetNew: async (_: any, data: any, context: any) => {
      try {
        let { passwordResetInfo } = data;
        let { req } = context;
        let msg = await restorePasswordSetNew({ ...passwordResetInfo });
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        if (error == "INVALID-CODE") {
          throw new AuthenticationError(error);
        }
        throw new UserInputError("Some error with your inputs", { ...error });
      }
    }
  },
  Query: {
    ResendVerifyCode: async (_: any, data: any, context: any) => {
      try {
        let { username } = data;
        let msg = await resendVerifyCode(username);
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        if (error == "INVALID-CODE") {
          throw new AuthenticationError(error);
        }
        throw new UserInputError("Some error with your inputs", { ...error });
      }
    },
    Login: async (_: any, data: any, context: any) => {
      try {
        let { accessInfo } = data;
        console.log({ ...accessInfo });

        let msg = await login({ ...accessInfo });
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        if (error == "INVALID-CODE") {
          throw new AuthenticationError(error);
        }
        throw new UserInputError("Some error with your inputs", { ...error });
      }
    },
    RestorePasswordCode: async (_: any, data: any, context: any) => {
      try {
        let { email } = data;

        let msg = await restorePasswordCode(email);
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        if (error == "INVALID-CODE") {
          throw new AuthenticationError(error);
        }
        throw new UserInputError("Some error with your inputs", { ...error });
      }
    },
    RestorePasswordCompareCode: async (_: any, data: any, context: any) => {
      try {
        let { restoreInfo } = data;

        let msg = await restorePasswordCompareCode({ ...restoreInfo });
        return {
          msg,
          code: "200"
        };
      } catch (error) {
        if (error == "INVALID-CODE") {
          throw new AuthenticationError(error);
        }
        throw new UserInputError("Some error with your inputs", { ...error });
      }
    }
  }
};

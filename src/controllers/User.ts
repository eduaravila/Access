import random from "randomatic";
import {
  UserInputError,
  ApolloError,
  AuthenticationError
} from "apollo-server-express";
import {
  registerType,
  varifyAccountType,
  loginType,
  restorePasswordSetNewType
} from "./types";
import userModel from "../models/User/User";
import PreUserModel from "../models/User/PreUser";
import Jwt from "../utils/jwt";
import JwtMedia from "../utils/jwtMedia";
import { verification_email, password_reset_mail } from "../utils/mailer";
import pre_user_model from "../models/User/PreUser";

export const register = async (
  { username, password, email }: registerType,
  context: any
) => {
  try {
    let {
      country = " ",
      region = "",
      city = "",
      timezone = "",
      ll = []
    } = context.ipInfo;

    let new_user = new PreUserModel({
      username,
      email,
      password,
      location: {
        country,
        region,
        city,
        timezone,
        ll
      }
    });

    //? random verification code
    let code = random("0", 6);

    let token = new Jwt({ username, code });
    await token.create_token(
      "15m",
      context.body.variables.keyid,
      context.body.variables.privateKey
    );

    await verification_email(email, username, code);
    await new_user.save();
    //? save the user in a temporal table

    return Promise.resolve(token.token);
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const verifyAccount = async (
  { code, token }: varifyAccountType,
  context: any
) => {
  try {
    let localToken = await Jwt.validateToken(
      token,
      context.body.variables.publicKey
    );

    let tokenData: any = await Jwt.decrypt_data(localToken)();
    let userInfo = await PreUserModel.findOne({
      username: tokenData.username
    });

    if (!userInfo) {
      throw new Error("AUTORIZATION ERROR");
    }

    if (code === tokenData.code) {
      let { username, email, password, location } = userInfo;

      await new userModel({
        username,
        email,
        password,
        location
      }).save();

      await PreUserModel.deleteOne({ username });
      return Promise.resolve("Welcome to ecolote");
    }
    return Promise.reject("INVALID-CODE");
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const resendVerifyCode = async (username: string, context: any) => {
  try {
    let code = random("0", 6);
    let user = await PreUserModel.findOne({ username });
    let { email } = user;

    let token = new Jwt({ username, code });
    await token.create_token(
      "15m",
      context.body.variables.keyid,
      context.body.variables.privateKey
    );

    await verification_email(email, username, code);

    return Promise.resolve(token.token);
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const login = async ({ user, password }: loginType, { body }: any) => {
  try {
    let userId = await userModel.findOne({
      $or: [{ username: user }, { email: user }]
    });

    let token = new Jwt({ userId: userId._id.toString() });
    let tokenMedia = new JwtMedia({ userId: userId._id.toString() });

    await tokenMedia.create_token("21d");

    await token.create_token(
      "21d",
      body.variables.keyid,
      body.variables.privateKey
    );
    return Promise.resolve({
      token: token.token,
      media: tokenMedia.token,
      code: "200"
    });
    
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const restorePasswordCode = async (email: string, { body }: any) => {
  try {
    let code = random("0", 6);
    let user = await userModel.findOne({ email });
    console.log(body);

    if (!user) {
      throw new Error("AUTORIZATION ERROR");
    }

    let { username } = user;
    let token = new Jwt({ username, code, restore: "true" });
    await token.create_token(
      "15m",
      body.variables.keyid,
      body.variables.privateKey
    );

    await password_reset_mail(email, username, code);

    return Promise.resolve(token.token);
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const restorePasswordCompareCode = async (
  { code, token }: varifyAccountType,
  { body }: any
) => {
  try {
    console.log(code);

    let localToken = await Jwt.validateToken(token, body.variables.publicKey);
    let tokenData: any = await Jwt.decrypt_data(localToken)();
    let userInfo = await userModel.findOne({
      username: tokenData.username
    });

    if (!userInfo) {
      throw new Error("AUTORIZATION ERROR");
    }

    if (code === tokenData.code && tokenData.restore === "true") {
      return Promise.resolve("Valid code you can continue 😻");
    }
    return Promise.reject("INVALID-CODE");
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const restorePasswordSetNew = async (
  { code, token, password }: restorePasswordSetNewType,
  { body }: any
) => {
  try {
    let localToken = await Jwt.validateToken(token, body.variables.publicKey);
    let tokenData: any = await Jwt.decrypt_data(localToken)();
    let userInfo = await userModel.findOne({
      username: tokenData.username
    });

    if (!userInfo) {
      throw new Error("AUTORIZATION ERROR");
    }

    if (code === tokenData.code && tokenData.restore === "true") {
      await userModel.update_password(userInfo.email, password);
      return Promise.resolve("The password has been changed succesfully 🐲");
    }
    return Promise.reject("INVALID-CODE");
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const deletePreUser = async (username: string) => {
  try {
    let userInfo = await pre_user_model.findOneAndDelete({
      username
    });

    return Promise.resolve("Temp account deleted 😊");
  } catch (error) {
    throw new ApolloError(error);
  }
};

export const imageToken = async (ctx: any) => {
  try {
    let token = ctx.headers.token;

    let localToken = await Jwt.validateToken(
      token,
      ctx.body.variables.publicKey
    );

    let tokenData: any = await Jwt.decrypt_data(localToken)();

    console.log(tokenData);

    let tokenMedia = new JwtMedia({ userId: tokenData.userId });

    await tokenMedia.create_token("1d");

    return Promise.resolve(tokenMedia.token);
  } catch (error) {
    console.log(error);

    throw new ApolloError(error);
  }
};

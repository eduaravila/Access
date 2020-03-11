import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";

import {
  register,
  verifyAccount,
  restorePasswordSetNew,
  restorePasswordCode,
  resendVerifyCode,
  restorePasswordCompareCode,
  login,
  deletePreUser,
  imageToken
} from "../controllers/User";
import {
  SuccessResponse,
  RegisterInfo,
  verifyAccountInput,
  passwordResetInfo,
  LoginInfo,
  resendCodeInfo,
  restorePasswordCodeInput,
  CheckUserEmailAvailabeInput,
  AccessInfo
} from "../schema/UserSchema";

@Resolver()
export class RegisterResolver {
  @Mutation(returns => SuccessResponse)
  async DeletePreUser(
    @Arg("preUserInfo", () => resendCodeInfo) { username }: resendCodeInfo
  ) {
    let msg = await deletePreUser(username);
    return {
      msg,
      code: "200"
    };
  }

  @Mutation(returns => SuccessResponse)
  async RegisterUser(
    @Arg("registerInfo", () => RegisterInfo) registerInfo: RegisterInfo,
    @Ctx() ctx: any
  ) {
    console.log(ctx);

    let msg = await register(registerInfo, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Mutation(returns => SuccessResponse)
  async VerifyAccount(
    @Arg("accountInfo", () => verifyAccountInput)
    accountInfo: verifyAccountInput,
    @Ctx() ctx: any
  ) {
    console.log(ctx);

    let msg = await verifyAccount(accountInfo, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Mutation(resturns => SuccessResponse)
  async RestorePasswordSetNew(
    @Arg("passwordResetInfo", () => passwordResetInfo)
    passwordResetInfo: passwordResetInfo,
    @Ctx() ctx: any
  ) {
    let msg = await restorePasswordSetNew(passwordResetInfo, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Query(returns => SuccessResponse)
  async ResendVerifyCode(
    @Arg("resendCodeInfo", () => resendCodeInfo) { username }: resendCodeInfo,
    @Ctx() ctx: any
  ) {
    let msg = await resendVerifyCode(username, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Query(returns => SuccessResponse)
  async ImageToken(@Ctx() ctx: any) {
    let msg = await imageToken(ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Query(returns => SuccessResponse)
  async RestorePasswordCode(
    @Arg("restorePasswordCodeInput", () => restorePasswordCodeInput)
    { email }: restorePasswordCodeInput,
    @Ctx() ctx: any
  ) {
    let msg = await restorePasswordCode(email, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Query(returns => SuccessResponse)
  async RestorePasswordCompareCode(
    @Arg("restoreInfo", () => verifyAccountInput)
    restoreInfo: verifyAccountInput,
    @Ctx() ctx: any
  ) {
    let msg = await restorePasswordCompareCode(restoreInfo, ctx);
    return {
      msg,
      code: "200"
    };
  }

  @Query(returns => SuccessResponse)
  async CheckUserEmailAvailable(
    @Arg("userInfo", () => CheckUserEmailAvailabeInput)
    userInfo: CheckUserEmailAvailabeInput
  ) {
    return {
      msg: "User is available",
      code: "200"
    };
  }

  @Query(returns => AccessInfo)
  async Login(
    @Arg("accessInfo", () => LoginInfo)
    accessInfo: LoginInfo,
    @Ctx() ctx: any
  ) {
    return await login(accessInfo, ctx);
  }
}

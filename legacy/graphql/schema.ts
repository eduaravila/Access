const { gql } = require("apollo-server");

export const typeDefs = gql`
  input registerUserType {
    username: String!
    password: String!
    email: String!
  }

  input verifyAccontType {
    code: String!
    token: String!
  }
  input passwordResetType {
    code: String!
    token: String!
    password: String!
  }

  input loginType {
    user: String!
    password: String!
  }

  type successResponse {
    msg: String
    code: String
  }

  type Mutation {
    RegisterUser(userInfo: registerUserType!): successResponse
    VerifyAccount(accountInfo: verifyAccontType!): successResponse
    RestorePasswordSetNew(
      passwordResetInfo: passwordResetType!
    ): successResponse
  }

  type Query {
    ResendVerifyCode(username: String!): successResponse
    RestorePasswordCode(email: String!): successResponse
    RestorePasswordCompareCode(restoreInfo: verifyAccontType!): successResponse
    Login(accessInfo: loginType): successResponse
  }

  schema {
    mutation: Mutation
    query: Query
  }
`;

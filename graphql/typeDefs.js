const { gql } = require("apollo-server");

module.exports = gql`
  # data fields in Post
  type Post { 
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  # data fields in User
  type User{ 
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  # for the register form
  input RegisterInput{ 
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
`;

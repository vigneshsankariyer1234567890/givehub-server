const User = require('../../models/User');

module.exports = {
    Mutation: {
        register(_, { registerInput: {username, email, password, confirmPassword}}, context, info){
            // TODO: validate user data
            // TODO: Make sure user doesnt already exist
            // TODO: Hash password and create an auth token

        }
    }

}
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id});
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('No user found with this email.');
            }
            const correctPass = await user.isCorrectPassword(password);

            if (!correctPass) {
                throw new AuthenticationError('Incorrect password.');
            }

            const token = signToken(user);

            return {token, user};
        },
        addUser: async (parent, {username, email, password, }) => {
            const user = await User.create({ username, email, password});
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { savedBooks: args} },
                    { new: true, runValidators: true}
                );
                return updatedUser;
            }
            
            throw new AuthenticationError('You need to be logged in!');
            
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const deleteUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $pull: { savedBooks: { bookId: args.bookId} } },
                    { new: true }
                );
                return deleteUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }

}

module.exports = resolvers;
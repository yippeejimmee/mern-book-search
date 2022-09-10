const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            console.log('hello')
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id}).select("-__v -password");
                return userData;

            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            console.log('testing login');
            const user = await User.findOne({email});
            console.log('attempting log', user)
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
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            console.log('hello', args)
            return { token, user };

        },
        saveBook: async (parent, args, context) => {
            console.log('inside saveBook');
            if (context.user) {
                console.log('this is args', args.storedBooks)
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id},
                    { $addToSet: { savedBooks: args.storedBooks } },
                    { new: true, runValidators: true}
                );
                console.log('this is updated user', updateUser);
                console.log(updateUser.savedBooks)
                return updateUser;
            }
            
            throw new AuthenticationError('You need to be logged in!');
            
        },
        removeBook: async (parent, args, context) => {
            if (context.user) {
                const deleteUser = await User.findOneAndUpdate(
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
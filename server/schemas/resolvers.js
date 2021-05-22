const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    getMe: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');
        
          return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  },

  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true } 
          )
          .select('-__v -password')
          .populate('savedBooks');
          return userData;
      }

      throw new AuthenticationError('Not logged in');
    },

    deleteBook: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true}
          )
          .select('-__v -password')
          .populate('savedBooks');
        
          return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  }
};

// const resolvers = {
//   Query: {
//     getMe: async (parent, args, context) => {
//       if (context.user) {
//         const userData = await User.findOne({ _id: context.user._id })
//           .select('-__v -password')
//           .populate('savedBooks');
        
//           return userData;
//       }

//       throw new AuthenticationError('Not logged in');
//     }
//   }
// };

module.exports = resolvers;
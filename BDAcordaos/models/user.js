const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define User schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    // 0 - user, 1 - admin
  },
  active: {
    type: Boolean,
    default: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  favorites: {
    type: [{ acordaoId: String, title: String }],
  default: [],
  }
});

// Add passport-local-mongoose plugin to the schema
UserSchema.plugin(passportLocalMongoose);

// Add to favorites
UserSchema.statics.addFavorite = async function(userId, acordaoId, title) {
  return User.findById({ _id: userId })
    .then(user => {
      user.favorites.push({ acordaoId, title });
      user.save()
        .then(() => {
          return true;
        })
        .catch(err => {
          return false;
        });
    })
    .catch(err => {
      return false;
    }
  );
}

// Remove from favorites
UserSchema.statics.removeFavorite = async function(userId, acordaoId) {
  return User.findById({ _id: userId })
    .then(user => {
      const index = user.favorites.findIndex(fav => fav.acordaoId === acordaoId);
      if (index > -1) {
        user.favorites.splice(index, 1);
      }
      user.save()
        .then(() => {
          return true;
        })
        .catch(err => {
          return false;
        });
    })
    .catch(err => {
      return false;
    }
  );
}

// Get favorites
UserSchema.statics.getFavorites = async function(userId) {
  try {
    const user = await User.findById(userId);
    return user.favorites;
  } catch(err) {
    throw err;
  }
};


// Create the User model from the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
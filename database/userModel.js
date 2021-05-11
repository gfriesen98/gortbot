const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

const salts = 10;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
	role: {
		type: String,
		required: true,
		default: "user"
	},
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  }

});

/**
 * Before saving to the database, salt and hash the password!
 */
userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  try{
    const salt = await bcrypt.genSalt(salts);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

/**
 * Mongoose User Schema Function
 * isCorrectPassword(password, callback)
 * 
 * Compares the password submitted with the password stored
 */
userSchema.methods.isCorrectPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, same){
    console.log(this.password, password)
    if(err){
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

module.exports = mongoose.model("User", userSchema);
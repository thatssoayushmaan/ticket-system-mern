const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true,
      },
      company: {
        type: String,
        maxlength: 50,
        required: true,
      },
      address: {
        type: String,
        maxlength: 100,
      },
      phone: {
        type: Number,
        maxlength: 11,
        unique : true,
      },
      email: {
        type: String,
        maxlength: 50,
        required: true,
        unique : true,
      },
      password: {
        type: String,
        minlength: 8,
        maxlength: 100,
        required: true,
      },
      refreshJWT : {
        token : {
          type: String,
          default : ""
        },
        addedAt : {
          type: Date,
          required: true,
          default: Date.now()
        }
      }
})

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next()
  }
  const salt = await bcrypt.genSalt(8)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPasswords = async function(password){
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', userSchema)

module.exports = User
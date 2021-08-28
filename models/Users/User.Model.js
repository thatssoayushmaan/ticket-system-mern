const mongoose =require('mongoose')
const User = require('./User.Schema')


const insertUser = (userObj) => {
    return new Promise((resolve, reject) =>{
        User(userObj)
            .save()
            .then((data)=> resolve(data))
            .catch((error)=> reject(error))
    })
}

const getUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        if(!email) return false
        User.findOne({email}, (err, data) => {
            if(err){
                reject(error)
            }else{
                resolve(data)
            }
        })
    })
}

const storeUserRefreshJWT = (_id, token) => {
    return new Promise((resolve, reject) => {
      try {
        User.findOneAndUpdate(
          { _id },
          {
            $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const getUserById = (_id) => {
    return new Promise((resolve, reject) => {
      if (!_id) return false;
  
      try {
        User.findOne({ _id }, (error, data) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(data);
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  const updatePassword = (email, newhashedPass) => {
    return new Promise((resolve, reject) => {
      try {
        User.findOneAndUpdate(
          { email },
          {
            $set: { password: newhashedPass },
          },
          { new: true }
        )
          .then((data) => resolve(data))
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

module.exports = {
    insertUser,
    getUserByEmail,
    storeUserRefreshJWT,
    getUserById,
    updatePassword
}
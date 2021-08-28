const { token } = require("morgan");
const Pin = require("./ResetPin.Schema");

const {randomPinNumber} = require('../../utils/randomGenerator')

const setPasswordResetPin = async (email) => {
    //reand 6 digit
    const pinLength = 6;
    const randPin = await randomPinNumber(pinLength);
  
    const restObj = {
      email,
      pin: randPin,
    };
  
    return new Promise((resolve, reject) => {
      Pin(restObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
  };

  const getPinByEmailPin = (email, pin) => {
    return new Promise((resolve, reject) => {
      try {
        Pin.findOne({ email, pin }, (error, data) => {
          if (error) {
            console.log(error);
            resolve(false);
          }
  
          resolve(data);
        });
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  };

  const deletePin = (email, pin) => {
    try {
      ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = {
    setPasswordResetPin,
    getPinByEmailPin,
    deletePin,
  }
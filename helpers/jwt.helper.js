const jwt = require('jsonwebtoken')
const { setJWT, getJWT } = require("./redis.helper");
const {storeUserRefreshJWT} = require('../models/Users/User.Model')

const createAccessJWT = async (email, _id) => {
  try {
    const accessJWT = await jwt.sign({ email }, process.env.ACCESS_KEY, {
      expiresIn: "1d",
    });

    await setJWT(accessJWT, _id);

    return Promise.resolve(accessJWT);
  } catch (error) {
    return Promise.reject(error);
  }
}

const createRefreshJWT = async (email, _id) => {
    try {
        const refreshJWT = await jwt.sign({email}, process.env.REFRESH_KEY, {expiresIn : "10d"})

        await storeUserRefreshJWT(_id, refreshJWT)

        return Promise.resolve(refreshJWT)
    } catch (error) {
        return Promise.reject(error)
    }
}

const verifyAccessJWT = (userJWT) => {
    try {
      return Promise.resolve(jwt.verify(userJWT, process.env.ACCESS_KEY));
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const verifyRefreshJWT = (userJWT) => {
    try {
      return Promise.resolve(jwt.verify(userJWT, process.env.REFRESH_KEY));
    } catch (error) {
      return Promise.reject(error);
    }
  };

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    verifyAccessJWT,
    verifyRefreshJWT
}
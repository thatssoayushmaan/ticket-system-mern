const router = require('express').Router()

const {verifyRefreshJWT, createAccessJWT} = require('../helpers/jwt.helper')
const { getUserByEmail } = require('../models/Users/User.Model')

router.get('/', async (req,res,next) => {
    const {authorization} = req.headers
    try {
        const decoded = await verifyRefreshJWT(authorization)
    if(decoded.email){
        const userProf = await getUserByEmail(decoded.email)
        if(userProf._id){
            // res.status(200).json(userProf)
            let tokenExp = userProf.refreshJWT.addedAt
            const dbrefreshToken = userProf.refreshJWT.token
            //console.log(dbrefreshToken)
 
            tokenExp = tokenExp.setDate(tokenExp.getDate() + +process.env.EXP_DATE)
            //console.log(new Date(tokenExp))

            const today = new Date()

            if(dbrefreshToken !== authorization && tokenExp < today) {
                res.json(403).json("Forbidden Door")
            }

            const accessToken = await createAccessJWT(decoded.email,userProf._id.toString())
            res.status(200).json(accessToken)
        }
    }
    } catch (error) {
        res.status(403).json(error.message)
    }
    

})

module.exports = router
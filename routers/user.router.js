const express = require('express')
const User = require('../models/Users/User.Schema')
const router = express.Router()
const bcrypt = require('bcrypt')
const { createAccessJWT, createRefreshJWT } = require('../helpers/jwt.helper')
const {userAuthorization} = require('../middlewares/auth.mw')
const {getUserById, getUserByEmail, updatePassword, storeUserRefreshJWT} = require('../models/Users/User.Model')
const { setPasswordResetPin, getPinByEmailPin, deletePin } = require('../models/ResetPin/ResetPin.Model')
const { emailProcessor } = require('../helpers/email.helper')
const {hashPassword, comparePassword} = require('../helpers/bcrypt.helper')
const {resetPassReqValidation, updatePassValidation} = require('../middlewares/formValidation.mw')
const { deleteJWT } = require('../helpers/redis.helper')



// router.all('/', (req,res,next) => {
//     res.json({
//         message : 'Return From User router'
//     })
//     next()
// })

//Register
router.post('/', async (req, res) => {
    const { email, password, name, company, address, phone } = req.body
    try {
        const newUser = User.create({ email, password, name, company, address, phone })
        // const user = await newUser.save()
        res.status(200).json("Register successful")
    } catch (error) {
        console.log(error)
        res.json({
            status: "Insert User Error",
            message: error.message
        })
    }
})

//Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.json("Please enter your email and password")
    }
    try {
        // const user = await User.findOne({ email })
        // !user && res.status(401).json("Invalid Credentials")

        // const isMatch = await User.matchPasswords(password)
        // !isMatch && res.status(401).json("Invalid Password")

        const user = await getUserByEmail(email);

        const passFromDb = user && user._id ? user.password : null;

        if (!passFromDb)
		return res.json({ status: "error", message: "Invalid email or password!" });

        const result = await comparePassword(password, passFromDb);

        if (!result) {
            return res.json({ status: "error", message: "Invalid email or password!" });
        }

        const accessJWT = await createAccessJWT(user.email, `${user._id}`)
        const refreshJWT = await createRefreshJWT(user.email, user._id)

        res.status(200).json({user, accessJWT, refreshJWT})
    } catch (error) {
        console.log(error)
    }
})

//Get user profile
router.get("/", userAuthorization, async (req, res) => {
	//this data coming form database
	const _id = req.userId;

	const userProf = await getUserById(_id);
	const { name, email } = userProf;
	res.json({
		user: {
			_id,
			name,
			email,
		},
	});
});

router.post('/reset-password', resetPassReqValidation, async (req,res) => {
    const {email} = req.body

    const user = await getUserByEmail(email)

    if(user && user._id){
        const setPin = await setPasswordResetPin(email)
        await emailProcessor({
			email,
			pin: setPin.pin,
			type: "request-new-password",
		});
        deletePin(email,pin)
        
    }

    res.status(200).json({
        status : "success",
        message : "If the email is exist in our database, the password reset pin will be sent shortly."
    })
})

router.patch('/reset-password', updatePassValidation, async (req,res) => {
    const {email, pin, newPassword} = req.body

    const getPin = await getPinByEmailPin(email, pin)

    if(getPin._id){
        const dbDate = getPin.addedAt;

        const expiresIn = 1;

		let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);

		const today = new Date();

        if (today > expDate) {
			return res.json({ status: "error", message: "Invalid or expired pin." });
		}

        const hashedPassword = await hashPassword(newPassword)

        const user = await updatePassword(email, hashedPassword)

        if(user._id){
            // send email notification
			await emailProcessor({ email, type: "update-password-success" });


            return res.json({
				status: "success",
				message: "Your password has been updated",
			});
        }
    }
    res.json({
		status: "error",
		message: "Unable to update your password. Please try again later",
	});
})


router.delete('/logout', userAuthorization, async (req,res) => {
    const {authorization} = req.headers
    const _id = req.userId
    try {
        deleteJWT(authorization) 

    const result = await storeUserRefreshJWT(_id, "")

    if (result._id) {
		return res.json({ status: "success", message: "Logged out successfully" });
	}
    } catch (error) {
        res.json({
            status: "error",
            message: "Unable to log you out, please try again later",
        });   
    }
})


module.exports = router
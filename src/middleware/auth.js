const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const Authenthicate = async (req,res,next) => {
     try {
        const token = req.header('Authorization').replace('Bearer ','');
        const verify = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findOne({ _id: verify._id, "tokens.token": token})
        if(!user){
            throw new error
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: 'Please Authenticate.'})
    }

}

module.exports = Authenthicate;
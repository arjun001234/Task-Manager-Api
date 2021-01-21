const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'arjunkanojia@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome, ${name} we're glad you're here`
    })
}

const sendCancellationMail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'arjunkanojia001@gmail.com',
        subject: 'Good-Bye',
        text: `Thanks, ${name} for being are part. Waiting for your valuable feedback`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancellationMail
}

/**
   const express = require('express');
const User = require('../models/usermodel');
const auth = require('../middleware/auth');
const { sendWelcomeMail, sendCancellationMail } = require('../emails/sendemails');
const multer = require('multer');
const sharp = require('sharp');

const upload = multer({
    limits: 1000000,
    fileFilter(req,file,cb) {
        const allowedfile = file.originalname.match(/\.(jpg|jpeg|png)$/);
        if(!allowedfile){
            return cb( new Error('Invalid File Upload'),false)
        }
        cb(null,true)
    }
})

const userRouter = new express.Router();

userRouter.post('/users', async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeMail(user.email,user.name);
        const token = await user.generateAuthTokens();
        res.status(201).send({user,token});
    } catch (error) {
      res.status(400).send(error);
    }
})

userRouter.post('/users/login', async (req,res) => {
    try {
        const user = await User.comparePassword(req.body.email,req.body.password);
        const token = await user.generateAuthTokens();
        res.send({user,token})
    } catch (error) {
        res.status(500).send();
    }
})

userRouter.post('/users/logout',auth,async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error)
    }
})
userRouter.post('/users/logoutall',auth,async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error)
    }
})
userRouter.get('/users/me',auth, async (req,res) => {
    res.send(req.user);
})

userRouter.patch('/users/me',auth,async (req,res) => {
    const updateValue = Object.keys(req.body); 
    const allowedvalues = ['name','email','password'];
    const verifyUpdate = updateValue.every((update) => allowedvalues.includes(update));
    if(!verifyUpdate){
        return res.status(400).send('invalid update')
    }
    try {
        updateValue.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
})

userRouter.delete('/users/me',auth, async (req,res) => {
    try {
        await req.user.remove();
        sendCancellationMail(req.user.mail,req.user.name)
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
})

userRouter.post('/users/me/avatar',auth, upload.single('avatar') ,async(req,res) => {
    const buffer = sharp(req.file.buffer).png().resize({ height: 100, width: 100}).toBuffer();   
    req.user.avatar = buffer
       await req.user.save();
       res.send();
},(error,req,res,next) =>{
    res.status(400).send({error: error.message})
})

userRouter.delete('/users/me/avatar',auth, async (req,res) => {
         
})

module.exports = userRouter;
  
 */
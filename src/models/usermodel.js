const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tasks = require('./taskmodel');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: function(email) {
            const checkEmail = validator.isEmail(email);
            return checkEmail
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate: function() {
           return true
        }
    },
    age: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthTokens = async function ()  {
    const user = this;
    const token =  jwt.sign({ _id: user._id.toString()},process.env.JWT_SECRET);
    user.tokens = await user.tokens.concat({token})
    await user.save();
    return token
}

userSchema.pre("save", async function(next) {
    const user = this;
    if(!user.isModified("password")){
        return next();
    }
    user.password = await bcrypt.hash(user.password,8);
    next();
})

userSchema.statics.comparePassword =  async function (email,plainText) { 

    const user = await User.findOne({email})
     if(!user){
        throw new Error('Invalid Email')
    }
        const checkPassword = await bcrypt.compare(plainText,user.password)
    if(!checkPassword){
        throw new Error('Invalid Password')
    }
    return user
}

userSchema.pre('remove', async function (next){
    const user = this
    await Tasks.deleteMany({owner: user._id})
    next()
})


const User = mongoose.model('user',userSchema)

module.exports = User;

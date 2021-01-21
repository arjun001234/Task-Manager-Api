const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
/** 
const task1 = new Tasks({
    task: "get the chores done",
})

task1.save().then((result) => {
    console.log(result)
}).catch((error) => {
    console.log(error);
}) */
/** 
const User = mongoose.model('Users',{
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            if(value.includes('password')) {
                throw new Error('Try Different Password')
            }
        }
    }
})

const user1 = new User({
    name: "   Arjun  ",
    password: "password"
})

user1.save().then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error)
}) */
const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    task: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'user'
    }
},{
    timestamps: true
})

const Tasks = mongoose.model('Tasks',taskSchema);
module.exports = Tasks;
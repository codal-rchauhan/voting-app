let mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    mobile: {
        type: string
    },
    aadhar_number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: string,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) {

    // Hash the password only it's new or modified
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        this.password = hashedPassword;

        return next();
    } catch(error) {
        return next(error);
    } 
})

userSchema.statics.comparePassword = async function(userPasswod) {

    try {
        const isMatch = await bcrypt.compare(userPasswod, this.password);

        return isMatch;
    } catch (error) {
        throw error;
    }
}

const user = new mongoose.model('User', userSchema);
module.exports = user;
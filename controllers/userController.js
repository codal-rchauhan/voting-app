const User = require('../models/user');
const generateToken = require('../middleware/jwt');

const singUp = async function (req, res) {

    let userData = req.body;
    try {
        const adminUser = await User.findOne({ role: 'admin' })
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ message: 'Admin user already exist' });
        }

        const newUser = new User(userData);
        const response = await newUser.save();

        // TODO: Generate token
        const token = generateToken(userData);
        res.status(200).json({ response: response, token: token, message: 'User Created successfully' })

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const login = async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;

        if (!aadharCardNumber || !password) {
            res.status(400).json('Aadhar card number and password are required!');
        }

        // Fund User by aadhar card number
        let user = await User.findOne({ aadharCardNumber: aadharCardNumber });
        if (!user) {
            res.status(400).json('User does not exist for this aadhar card number');
        }

        if (!user || !(await user.comparePassoword(password))) {
            res.status(401).json('Invalid aadhar card number or password!');
        }

        // TODO: generate token
        const token = generateToken(userData);

        res.status(200).json({ token: token, message: 'User login successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const profileDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await User.findById(userId);

        res.status(200).json({ response: userProfile, message: 'Profile details fetched successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.body.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both current password and password are required' });
        }

        let user = await User.findById({ id: userId });

        if (!user || !(await user.comparePassoword(currentPassword))) {
            res.status(401).json('Invalid aadhar card number or password!');
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ response: data, message: 'Password updated succssfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    singUp,
    login,
    profileDetails,
    changePassword
}

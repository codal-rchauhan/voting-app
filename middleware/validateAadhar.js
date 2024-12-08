const User = require('../models/user');

module.exports = async (req, res, next) => {
    const aadharCardNumber = req.body.aadharNumber;

    if (!/^\d{12}$/.test(aadharCardNumber)) {
        return res.status(400).json({ error: 'Aadhar card number must be 12 digits' });
    }

    // Check aadhar card number exist or not
    try {
        const userExist = await User.findOne({ aadhar_number: data.aadharCardNumber });
        if (userExist) {
            return res.status(400).json({ message: "User wit the same aadharcard number already exist"});
        }
    } catch (error) {
        res.status(500).json({error: 'Server error'});
    }
}

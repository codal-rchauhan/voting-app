const User = require('../models/user');

exports.checkAdminRole = async function(userId) {
    try {
        const userData = await User.findById(userId);
        if (!userData && userData.role !== 'admin') {
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
}

const User = require('../../models/user');

const addUser = async (req, res) => {
    const data = req.body;try {
        const { name, surname, email, password, admin } = data;
        const date = new Date();

        await User.create({ name, surname, email, password, admin, date });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ date: -1 });    const response = {
            success: true,
            users,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
};

const removeUser = async (req, res) => {
    const id = req.body.id;try {
        const user = await User.findById(id);
        if (user.admin) return res.status(403).json({ success: false });

        await User.findByIdAndDelete(id);

        const response = {
            success: true,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
};

const getEmails = async (req, res) => {
    try {
        const users = await User.find().sort({ date: -1 }).limit(15);
        const emails = users.map(user => user.email);    const response = {
            success: true,
            emails,
        };
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
};

module.exports = {
    addUser,
    getUsers,
    getEmails,
    removeUser,
};
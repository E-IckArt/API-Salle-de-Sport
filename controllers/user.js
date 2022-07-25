const encryptPassword = require('../utils/encryptPassword');
const decryptPassword = require('../utils/decryptPassword');

async function userLogin(req, res) {
    try {
        if (!req.body._id || !req.body.password) {
            return res.json('Missing _id or password');
        }
        const User = req.app.get('models').User;
        const toVerifyUser = await User.findById(req.body._id);
        if (!toVerifyUser) {
            return 'No user found';
        }
        res.json(decryptPassword(toVerifyUser, req.body.password));
    } catch (error) {
        res.json(error.message);
    }
}

async function userGet(req, res) {
    try {
        const User = req.app.get('models').User;
        const MyUsers = await User.find();
        res.json(MyUsers);
    } catch (error) {
        res.json(error.message);
    }
}
async function userCreate(req, res) {
    try {
        if (!req.body.password) {
            return res.json('No password');
        }
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }
        const { token, salt, hash } = encryptPassword(req.body.password);

        const User = req.app.get('models').User;
        const NewUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            token,
            salt,
            hash,
        }).save();
        res.json(NewUser);
    } catch (error) {
        res.json(error.message);
    }
}

async function userUpdate(req, res) {
    try {
        if (!req.body._id) {
            return res.json('_id ou champs manquant(s)');
        }
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }

        const User = req.app.get('models').User;
        const ToModifyUser = await User.findById(req.body._id);
        if (!ToModifyUser) {
            return res.json('User not found');
        }
        const toModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            ToModifyUser[key] = req.body.toModify[key];
        }
        await ToModifyUser.save();
        res.json(ToModifyUser);
    } catch (error) {
        res.json(error.message);
    }
}

async function userDelete(req, res) {
    try {
        if (!req.body._id) {
            return res.json('_id manquant');
        }
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }

        const User = req.app.get('models').User;
        const ToDeleteUser = await User.findById(req.body._id);
        if (!ToDeleteUser) {
            return res.json('User not found');
        }
        await ToDeleteUser.remove();
        res.json('Successfully Deleted !');
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = { userGet, userCreate, userDelete, userUpdate, userLogin };

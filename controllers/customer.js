const encryptPassword = require('../utils/encryptPassword');

async function customers(req, res) {
    const Customer = req.app.get('models').Customer;
    const CustomersList = await Customer.find()
        .populate('user_id')
        .populate('subscriptions')
        .populate('slots');
    res.json(CustomersList);
}

async function customerCreate(req, res) {
    try {
        if (!req.body.password) {
            return res.json('No password');
        }
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }

        const models = req.app.get('models');
        const { token, salt, hash } = encryptPassword(req.body.password);

        const NewUser = await new models.User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            password: req.body.password,
            token,
            salt,
            hash,
        }).save();
        const NewCustomer = await new models.Customer({
            user_id: NewUser._id,
        }).save();
        res.json(NewCustomer);
    } catch (error) {
        res.json(error.message);
    }
}

async function customerUpdate(req, res) {
    try {
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }
        if (!req.body._id) {
            return res.json('_id ou champs manquant(s)');
        }

        const Customer = req.app.get('models').Customer;
        const ToModifyCustomer = await Customer.findById(req.body._id);
        if (!ToModifyCustomer) {
            return res.json('Customer not found');
        }
        const toModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            ToModifyCustomer[key] = req.body.toModify[key];
        }
        await ToModifyCustomer.save();
        res.json(ToModifyCustomer);
    } catch (error) {
        res.json(error.message);
    }
}

async function customerDelete(req, res) {
    try {
        if (!req.body._id) {
            return res.json('_id manquant');
        }
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }

        const models = req.app.get('models');
        const Customer = req.app.get('models').Customer;
        const ToDeleteCustomer = await Customer.findById(req.body._id);
        if (!ToDeleteCustomer) {
            return res.json('Customer not found');
        }

        const ToDeleteUser = await models.User.findById(
            ToDeleteCustomer.user_id
        );

        await ToDeleteUser.remove();
        await ToDeleteCustomer.remove();
        res.json('Successfully Deleted !');
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    customerCreate,
    customers,
    customerUpdate,
    customerDelete,
};

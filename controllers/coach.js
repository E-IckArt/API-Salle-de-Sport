const encryptPassword = require('../utils/encryptPassword');

async function coaches(req, res) {
    const Coach = req.app.get('models').Coach;
    let CoachesList;
    if (req.query.discipline) {
        CoachesList = await Coach.find({
            discipline: req.query.discipline,
        })
            .populate('user_id')
            .populate('slots');
    } else {
        CoachesList = await Coach.find().populate('user_id');
    }
    res.json(CoachesList);
}

async function coachCreate(req, res) {
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
            role: 'coach',
            token,
            salt,
            hash,
        }).save();
        const newCoach = await new models.Coach({
            user_id: NewUser._id,
        }).save();
        res.json(newCoach);
    } catch (error) {
        res.json(error.message);
    }
}

async function coachUpdate(req, res) {
    try {
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }
        if (!req.body._id) {
            return res.json('_id ou champs manquant(s)');
        }

        const Coach = req.app.get('models').Coach;
        const ToModifyCoach = await Coach.findById(req.body._id);
        if (!ToModifyCoach) {
            return res.json('Coach not found');
        }
        const toModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            ToModifyCoach[key] = req.body.toModify[key];
        }
        await ToModifyCoach.save();
        res.json(ToModifyCoach);
    } catch (error) {
        res.json(error.message);
    }
}

async function coachDelete(req, res) {
    try {
        if (!req.body._id) {
            return res.json('_id manquant');
        }
        // Si la personne qui veut créer un utilisateur n'est pas manager : pas d'autorisation
        if (req.role !== 'manager') {
            return res.json('Unauthorized !');
        }

        const models = req.app.get('models');
        const Coach = req.app.get('models').Coach;
        const ToDeleteCoach = await Coach.findById(req.body._id);
        if (!ToDeleteCoach) {
            return res.json('Coach not found');
        }

        const ToDeleteUser = await models.User.findById(ToDeleteCoach.user_id);

        await ToDeleteUser.remove();
        await ToDeleteCoach.remove();
        res.json('Successfully Deleted !');
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    coaches,
    coachCreate,
    coachUpdate,
    coachDelete,
};

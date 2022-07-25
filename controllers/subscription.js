async function subscriptions(req, res) {
    const Subscription = req.app.get('models').Subscription;
    const SubscriptionsList = await Subscription.find();
    res.json(SubscriptionsList);
}

async function subscriptionCreate(req, res) {
    if (req.role !== 'manager') {
        return res.json('Unauthorized !');
    }
    try {
        const models = req.app.get('models');
        // create New subscription
        const NewSubscription = await new models.Subscription({
            beginningDate: req.body.beginningDate,
            endDate: req.body.endDate,
            paymentMethod: req.body.paymentMethod,
            amountPaid: req.body.amountPaid,
            customer: req.body.customer,
        }).save();
        const theCustomer = await models.Customer.findById(req.body.customer);
        theCustomer.subscriptions.push(NewSubscription._id);
        await theCustomer.save();
        res.json(NewSubscription);
    } catch (error) {
        res.json(error.message);
    }
}

async function subscriptionUpdate(req, res) {
    if (req.role !== 'manager') {
        return res.json('Unauthorized !');
    }
    try {
        if (!req.body._id) {
            return res.json('No _id provided');
        }

        const Subscription = req.app.get('models').Subscription;
        const ToModifySubscription = await Subscription.findById(req.body._id);
        if (!ToModifySubscription) {
            return res.json('Subscription not found');
        }
        const toModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            ToModifySubscription[key] = req.body.toModify[key];
        }
        await ToModifySubscription.save();
        res.json(ToModifySubscription);
    } catch (error) {
        res.json(error.message);
    }
}

async function subscriptionDelete(req, res) {
    if (req.role !== 'manager') {
        return res.json('Unauthorized !');
    }
    try {
        if (!req.body._id) {
            return res.json('No _id provided');
        }

        const models = req.app.get('models');
        const Subscription = models.Subscription;
        let toDeleteSubscription = await Subscription.findById(req.body._id);
        if (!toDeleteSubscription) {
            return res.json('Subscription not found');
        }

        let theCustomer = await models.Customer.findById(
            toDeleteSubscription.customer
        );
        let toDeleteIndex = theCustomer.subscriptions.indexOf(
            toDeleteSubscription._id
        );
        theCustomer.subscriptions.splice(toDeleteIndex, 1);
        await theCustomer.save();

        await toDeleteSubscription.remove();
        res.json('Successfully Deleted !');
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    subscriptionCreate,
    subscriptions,
    subscriptionUpdate,
    subscriptionDelete,
};

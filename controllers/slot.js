async function slots(req, res) {
    const Slot = req.app.get('models').Slot;
    const slotsList = await Slot.find();
    res.json(slotsList);
}

async function slotCreate(req, res) {
    if (req.role !== 'coach') {
        return res.json('Unauthorized !');
    }
    try {
        const models = req.app.get('models');
        // Create the slot
        const NewSlot = await new models.Slot({
            date: req.body.date,
            startHour: req.body.startHour,
            endHour: req.body.endHour,
            label: req.body.label,
            peopleLimit: req.body.peopleLimit,
            coach: req.body.coach,
            customers: [],
        }).save();

        // Add newSlot to the coach
        const theCoach = await models.Coach.findById(req.body.coach);
        theCoach.slots.push(NewSlot._id);
        theCoach.save();

        res.json(NewSlot);
    } catch (error) {
        res.json(error.message);
    }
}

async function slotBook(req, res) {
    try {
        if (req.role !== 'customer') {
            return res.json('Unauthorized !');
        }
        const models = req.app.get('models');
        const theSlot = await models.Slot.findById(req.body.slot);

        if (theSlot.customers.length >= theSlot.peopleLimit) {
            return 'No spot left for this slot';
        }
        const theCustomer = await models.Customer.findById(
            req.body.customer
        ).populate('subscriptions');

        //Check if subscription goes with the date
        let isSuscribed = false;
        for (const subscription of theCustomer.subscriptions) {
            if (
                subscription.beginningDate <= theSlot.date &&
                subscription.endDate >= theSlot.date
            ) {
                isSuscribed = true;
            }
        }
        if (isSuscribed) {
            theSlot.customers.push(theCustomer._id);
            await theSlot.save();
            theCustomer.slots.push(theSlot._id);
            await theCustomer.save();
            return res.json('Slot successfully booked');
        } else {
            return res.json(
                'No subscription for the slot date. Please subscribe before booking a slot'
            );
        }
    } catch (error) {
        res.json(error.message);
    }
}

async function slotUpdate(req, res) {
    if (req.role != 'coach') {
        return res.json('Unauthorized !');
    }
    try {
        if (!req.body._id) {
            return res.json('No _id provided');
        }
        const Slot = req.app.get('models').Slot;
        let toModifySlot = await Slot.findById(req.body._id);
        if (!toModifySlot) {
            return res.json('Slot not found');
        }
        const toModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            toModifySlot[key] = req.body.toModify[key];
        }
        await toModifySlot.save();
        res.json(toModifySlot);
    } catch (error) {
        res.json(error.message);
    }
}

async function slotDelete(req, res) {
    try {
        if (req.role !== 'coach') {
            return res.json('Unauthorized !');
        }
        if (!req.body._id) {
            return res.json('No _id provided');
        }

        const models = req.app.get('models');
        const Slot = models.Slot;
        const ToDeleteSlot = await Slot.findById(req.body._id);
        if (!ToDeleteSlot) {
            return res.json('Slot not found');
        }

        // Delete the slot in all customers slotsList
        for (const customer of ToDeleteSlot.customers) {
            let theCustomer = await models.Customer.findById(customer);
            let toDeleteIndex = theCustomer.slots.indexOf(ToDeleteSlot._id);
            theCustomer.slots.splice(toDeleteIndex, 1);
            await theCustomer.save();
        }

        // Delete the slot in the coach slotList
        let theCoach = models.Coach.findById(ToDeleteSlot.coach);
        let toDeleteIndex = theCoach.slots.indexOf(ToDeleteSlot._id);
        theCoach.slots.splice(toDeleteIndex, 1);
        await theCoach.save();

        await ToDeleteSlot.remove();
        res.json('Successfully Deleted !');
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    slots,
    slotCreate,
    slotBook,
    slotUpdate,
    slotDelete,
};

const {
    subscriptions,
    subscriptionCreate,
    subscriptionDelete,
    subscriptionUpdate,
} = require('../controllers/subscription');

function subscriptionRoute(app) {
    // Create
    app.post('/subscriptionCreate', subscriptionCreate);
    // Read
    app.get('/subscriptions', subscriptions);
    // Update
    app.post('/subscriptionUpdate', subscriptionUpdate);
    // Delete
    app.post('/subscriptionDelete', subscriptionDelete);
}

module.exports = subscriptionRoute;

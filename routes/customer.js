const {
    customers,
    customerCreate,
    customerDelete,
    customerUpdate,
    // customerLogin,
} = require('../controllers/customer');

function customerRoute(app) {
    // Create
    app.post('/customerCreate', customerCreate);
    // Read
    app.get('/customers', customers);
    // Update
    app.post('/customerUpdate', customerUpdate);
    // Delete
    app.post('/customerDelete', customerDelete);

    // Login
    // app.post('/customerLogin', customerLogin);
}

module.exports = customerRoute;

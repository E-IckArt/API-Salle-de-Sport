const {
    coaches,
    coachCreate,
    coachDelete,
    coachUpdate,
    // coachLogin,
} = require('../controllers/coach');

function coachRoute(app) {
    // Create
    app.post('/coachCreate', coachCreate);
    // Read
    app.get('/coaches', coaches);
    // Update
    app.post('/coachUpdate', coachUpdate);
    // Delete
    app.post('/coachDelete', coachDelete);

    // Login
    // app.post('/coachLogin', coachLogin);
}

module.exports = coachRoute;

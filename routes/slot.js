const {
    slots,
    slotCreate,
    slotBook,
    slotDelete,
    slotUpdate,
} = require('../controllers/slot');

function slotRoute(app) {
    // Create
    app.post('/slotCreate', slotCreate);
    // Book
    app.post('/slotBook', slotBook);
    // Read
    app.get('/slots', slots);
    // Update
    app.post('/slotUpdate', slotUpdate);
    // Delete
    app.post('/slotDelete', slotDelete);
}

module.exports = slotRoute;

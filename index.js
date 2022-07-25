const express = require('express');
const mongoose = require('mongoose');
const models = require('./models');
const getRoleMiddleware = require('./utils/getRoleMiddleware');
const localUri = 'mongodb://localhost:27017/sportCenters';

mongoose
    .connect(process.env.MONGODB_URI || localUri) // TODO - Créer une BDD distante pour pouvoir déployer le projet
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => {
        console.log('Connexion à MongoDB échouée !' + error.message);
        process.exit(1);
    });

const app = express();

app.set('models', models);

const userRoute = require('./routes/user');
const customerRoute = require('./routes/customer');
const coachRoute = require('./routes/coach');
const subcriptionRoute = require('./routes/subscription');
const slotRoute = require('./routes/slot');

// Les middlewares
app.use(express.json());
app.use(getRoleMiddleware);

userRoute(app);
customerRoute(app);
coachRoute(app);
subcriptionRoute(app);
slotRoute(app);

app.listen(3000, () => {
    console.log('Server successfully launched');
});

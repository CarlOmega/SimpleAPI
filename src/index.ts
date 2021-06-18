import * as functions from 'firebase-functions';
import * as express from 'express';
import RestaurantController from './controllers/restaurants';

const app = express();
const router = express.Router();

router.use('/restaurants', RestaurantController);

app.use('/', router);

exports.app = functions.https.onRequest(app);


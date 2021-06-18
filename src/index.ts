import * as functions from 'firebase-functions';
import * as express from 'express';
import { admin } from './config/firebase';

const app = express();

app.get('/', async (req, res) => {
  try {
    const userRecored = await admin.auth().getUserByEmail("carl.w.humphries@gmail.com");
    res.status(200).send(`Hey there ${userRecored.email}?!`);

  } catch (error) {
    res.status(500).send(error);
    return;
  }

  
});


exports.app = functions.https.onRequest(app);


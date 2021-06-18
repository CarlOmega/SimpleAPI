import * as functions from 'firebase-functions';
import * as express from 'express';
import { authEndpoint } from './middleware/authentication';

const app = express();

app.get('/', authEndpoint, async (req, res) => {
  try {
    res.status(200).send(`Hey there ${JSON.stringify(req.user)}?!`);
  } catch (error) {
    res.status(500).send(error);
    return;
  }
  
});

exports.app = functions.https.onRequest(app);


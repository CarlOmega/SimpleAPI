import { Response, Router, Request } from "express";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const RestaurantController = Router();
const db = admin.firestore().collection("restaurants")

RestaurantController.get("/", authEndpoint, async (req: Request, res: Response) => {
  const querySnapshot = await db.get();
  const data = querySnapshot.docs.map((doc) => doc.data());

  res.status(200).send(data);

});

export default RestaurantController;
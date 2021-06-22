import { Response, Router, Request } from "express";
import * as Joi from "joi";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const RestaurantController = Router();
const db = admin.firestore().collection("restaurants");

const newRestaurantSchema = Joi.object({
  name: Joi
    .string()
    .min(3)
    .max(30)
    .required(),
  description: Joi
    .string()
    .required(),
});

// Using CRUD

RestaurantController.post("/", authEndpoint, async (req: Request, res: Response) => {
  // Create new resturants if owner
  const user = req.user;
  if (!user.owner)
    return res.status(403).send({message: "Cannot perform action"});
  
  try {
    const restaurant: NewRestaurant = await newRestaurantSchema.validateAsync(req.body.restaurant);
    restaurant.owner = user.uid;
    restaurant.rating = 5.0;

    const document = await db.add(restaurant);
    return res.status(201).send(document.id);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

});

RestaurantController.get("/", authEndpoint, async (req: Request, res: Response) => {
  // Get all resturants if normal user or admin
  // Return only owned resturants if owner claim
  const user = req.user;
  let query = db.limit(10);
  if (user.owner)
    query = query.where("owner", "==", user.uid);
  
  try {
    const querySnapshot = await db.get();
    const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

RestaurantController.put("/", authEndpoint, async (req: Request, res: Response) => {
  // Create edit owned resturants if owner
  // Admin can edit any
  res.status(500);
});

RestaurantController.delete("/", authEndpoint, async (req: Request, res: Response) => {
  // Admin can delete any
  res.status(500);
});

export default RestaurantController;
import { Response, Router, Request } from "express";
import * as Joi from "joi";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const ReviewController = Router();
const db = admin.firestore().collection("restaurants");

const newReviewSchema = Joi.object({
  rating: Joi
    .number()
    .integer()
    .min(1)
    .max(5)
    .required(),
  comment: Joi
    .string()
    .required(),
  dateOfVisit: Joi
    .number()
    .integer()
    .min(1)
    .required(),
});

// Using CRUD

ReviewController.post("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  const user = req.user;
  const restaurantId = req.params.restaurantId;
  if (!user.user)
    return res.status(403).send({message: "Cannot perform action"});
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});

  const restaurantRef = db.doc(restaurantId);
  try {
    const review: Review = await newReviewSchema.validateAsync(req.body.review);
    review.author = user.uid;

    const document = await restaurantRef.collection("reviews").add(review);
    const restaurant =  (await restaurantRef.get()).data();
    if (!restaurant) throw Error("Issue with restaruant");
    restaurant.total += review.rating;
    restaurant.ratings++;
    restaurant.avg = restaurant.total / restaurant.ratings;
    restaurantRef.update(restaurant);

    return res.status(201).send(document.id);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

ReviewController.get("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  const restaurantId = req.params.restaurantId;
  if (!restaurantId) return res.status(400).send({message: "Need a restaurant ID"});

  const offset = req.query.offset;
  let query = db.doc(restaurantId).collection("reviews").orderBy("dateOfVisit", "desc").limit(5);
  if (offset && Number.isInteger(+offset))
    query = query.offset(+offset);
  
  try {
    const querySnapshot = await query.get();
    const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
});

ReviewController.put("/:restaurantId", authEndpoint, async (req: Request, res: Response) => {
  return res.status(501);
});

ReviewController.delete("/:restaurantId/:reviewId", authEndpoint, async (req: Request, res: Response) => {
  return res.status(501);
});

export default ReviewController;
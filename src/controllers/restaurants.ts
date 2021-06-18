import { Response, Router, Request } from "express";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const RestaurantController = Router();
const db = admin.firestore().collection("restaurants")

// Using CRUD

RestaurantController.post("/", authEndpoint, async (req: Request, res: Response) => {
  // Create new resturants if owner
  res.status(500);
});

RestaurantController.get("/", authEndpoint, async (req: Request, res: Response) => {
  // Get all resturants if normal user or admin
  // Return only owned resturants if owner claim

  const querySnapshot = await db.get();
  const data = querySnapshot.docs.map((doc) => doc.data());

  res.status(200).send(data);

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
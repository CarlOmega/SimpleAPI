import { Response, Router, Request } from "express";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const UserController = Router();
const db = admin.firestore().collection("users")

// Using CRUD

UserController.post("/", authEndpoint, async (req: Request, res: Response) => {
  // Upon account creation only
  
  res.status(500);
});

UserController.get("/", authEndpoint, async (req: Request, res: Response) => {
  // Get current user else if admin get ever user

  // Place holder taken from restaurants
  const querySnapshot = await db.get();
  const data = querySnapshot.docs.map((doc) => doc.data());
  res.status(200).send(data);

});

UserController.put("/", authEndpoint, async (req: Request, res: Response) => {
  // Admin seems to be only one who can update accounts
  res.status(500);
});

UserController.delete("/", authEndpoint, async (req: Request, res: Response) => {
  // Admin can delete any accounts
  res.status(500);
});

export default UserController;
import { Response, Router, Request } from "express";
import { admin } from "../config/firebase";
import { authEndpoint } from "../middleware/authentication";

const UserController = Router();

// Using CRUD

UserController.post("/", authEndpoint, async (req: Request, res: Response) => {
  // Upon account creation only
  const userClaims = req.user;
  const user: User = req.body.user;
  if (user.email.toLowerCase() !== userClaims.email)
    return res.status(403).send({message: "Incorrect user"});
  try {
    const claims: any = {};
    claims[user.accountType] = true;
    await admin.auth().setCustomUserClaims(userClaims.uid, claims);
    await admin.auth().updateUser(userClaims.uid, {displayName: user.userName});
    return res.status(201).send({message: "Success setting up account"});
  } catch (error) {
    return res.status(501).send({message: error.message});
  }
});

UserController.get("/", authEndpoint, async (req: Request, res: Response) => {
  // Get current user else if admin get ever user

  // Place holder taken from restaurants
  res.status(200).send({});

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
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
    return res.status(500).send({message: error.message});
  }
});

UserController.put("/", authEndpoint, async (req: Request, res: Response) => {
  // Admin seems to be only one who can update accounts
  if (!req.user.admin)
    return res.status(403).send({message: "Cannot perform action"});
  
  const uid = req.query.uid as string;
  const user = req.body.user;

  if (!uid) return res.status(400).send({message: "No uid in query"});
  if (!user) return res.status(400).send({message: "No user in body"});

  try {
    const firebaseUser = await admin.auth().getUser(uid);
    if (user.email && user.email.toLowerCase() !== firebaseUser.email)
      await admin.auth().updateUser(uid, {email: user.email.toLowerCase()});
    if (user.userName && user.userName !== firebaseUser.displayName)
      await admin.auth().updateUser(uid, {displayName: user.userName});
    return res.status(200).send({message: "Successful update"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
  
});

UserController.delete("/", authEndpoint, async (req: Request, res: Response) => {
  // Admin can delete any accounts
  if (!req.user.admin)
    return res.status(403).send({message: "Cannot perform action"});
  
  const uid = req.query.uid as string;
  try {
    await admin.auth().deleteUser(uid);
    return res.status(200).send({message: "Successful delete"});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }

});

export default UserController;
import { Router } from "express";
import RestaurantController from "../controllers/restaurants";
import UserController from "../controllers/users";

const router = Router();

router.use('/users', UserController);
router.use('/restaurants', RestaurantController);

export default router;
import { Router } from "express";
import RestaurantController from "../controllers/restaurants";

const router = Router();

router.use('/restaurants', RestaurantController);

export default router;
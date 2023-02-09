import { Router } from "express";
const router=Router();
import {findUser,signin,signup,saveRecipe} from "../controllers/user.js";



router.post("/signin",signin);
router.post("/signup",signup);
router.post("/saveRecipe/:id",saveRecipe);
router.get("/:id",findUser);


export default router;
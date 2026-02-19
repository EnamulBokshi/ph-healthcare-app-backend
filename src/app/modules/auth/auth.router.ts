import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();


router.post("/sign-up/email", AuthController.registerPatient);
router.post("/sign-in/email", AuthController.loginUser);

export const authRouter = router;
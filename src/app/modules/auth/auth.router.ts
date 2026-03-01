import { Router } from "express";
import { AuthController } from "./auth.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();


router.post("/sign-up/email", AuthController.registerPatient);
router.post("/sign-in/email", AuthController.loginUser);
router.get("/me", authCheck(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT), AuthController.getMe);
router.get("/refresh-token", AuthController.getNewToken);
router.post("/change-password", authCheck(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT), AuthController.changePassword);
router.post("/logout", authCheck(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN, UserRole.PATIENT), AuthController.logoutUser);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
export const authRouter = router;
import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();

router.post(
  "/create-doctor",
  authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createDoctorZodSchema),

  UserController.createDoctor,
);

// router.post("/create-admin", UserController.createAdmin);
// router.post("/create-superadmin", UserController.createSuperAdmin);

export const UserRouter = router;

import { Router } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../../middleware/validateRequest";
import { UserValidation } from "./user.validation";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";



const router = Router();

router.post(
  "/create-doctor",
  // authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.createDoctorZodSchema),

  UserController.createDoctor,
);

router.post(
  "/create-admin",
  authCheck(UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createAdmin
)

router.post(
  "/create-superadmin",
  authCheck(UserRole.SUPER_ADMIN),
  validateRequest(UserValidation.createAdminZodSchema),
  UserController.createSuperAdmin
)
// router.post("/create-admin", UserController.createAdmin);
// router.post("/create-superadmin", UserController.createSuperAdmin);

export const UserRouter = router;

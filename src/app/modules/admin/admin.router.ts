import { Router } from "express";

import { AdminController } from "./admin.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import validateRequest from "../../../middleware/validateRequest";
import { updateDoctorZodSchema } from "../doctor/doctor.validation";


const router = Router();

router.get("/", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.getAllAdmin);
router.get("/:adminId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), AdminController.getAdminById);
router.delete("/:adminId", authCheck(UserRole.SUPER_ADMIN), AdminController.deleteAdmin);
router.patch("/:adminId", authCheck(UserRole.SUPER_ADMIN),validateRequest(updateDoctorZodSchema),AdminController.updateAdmin);

export const AdminRouter = router;
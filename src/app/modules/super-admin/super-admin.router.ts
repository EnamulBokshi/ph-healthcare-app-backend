import { Router } from "express";

import { SuperAdminController } from "./super-admin.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../../middleware/validateRequest";
import { updateDoctorZodSchema } from "../doctor/doctor.validation";


const router = Router();

router.get("/", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SuperAdminController.getAllSuperAdmin);
router.get("/:superAdminId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SuperAdminController.getSuperAdminById);
router.delete("/:superAdminId", authCheck(UserRole.SUPER_ADMIN), SuperAdminController.deleteSuperAdmin);
router.patch("/:superAdminId", authCheck(UserRole.SUPER_ADMIN),validateRequest(updateDoctorZodSchema),SuperAdminController.updateSuperAdmin);

export const SuperAdminRouter = router;
import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";

const router:Router = Router();


router.post("/", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialityController.createSpeciality)
router.get("/", SpecialityController.getAllSpecialities)
router.delete("/:specialityId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialityController.deleteSpeciality)
router.patch("/:specialityId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialityController.updateSpeciality)
export const SpecialityRouter = router;
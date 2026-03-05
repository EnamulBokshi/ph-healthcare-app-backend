import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import validateRequest from "../../../middleware/validateRequest";
import { SpecialtyValidation } from "./specialty.validation";

const router:Router = Router();


router.post("/", 
    authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
    multerUpload.single("file"),
    validateRequest(SpecialtyValidation.createSpecialtyZodSchema),
    SpecialtyController.createSpecialty);
router.get("/", SpecialtyController.getAllSpecialities)
router.delete("/:specialtyId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialtyController.deleteSpecialty)
router.patch("/:specialtyId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialtyController.updateSpecialty)
export const SpecialtyRouter = router;
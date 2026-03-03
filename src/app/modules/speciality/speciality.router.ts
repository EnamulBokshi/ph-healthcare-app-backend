import { Router } from "express";
import { SpecialityController } from "./speciality.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import validateRequest from "../../../middleware/validateRequest";
import { SpecialityValidation } from "./speciality.validation";

const router:Router = Router();


router.post("/", 
    // authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), 
    multerUpload.single("file"),
    validateRequest(SpecialityValidation.createSpecialityZodSchema),
    SpecialityController.createSpeciality);
router.get("/", SpecialityController.getAllSpecialities)
router.delete("/:specialityId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialityController.deleteSpeciality)
router.patch("/:specialityId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), SpecialityController.updateSpeciality)
export const SpecialityRouter = router;
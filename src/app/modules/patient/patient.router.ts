import { NextFunction, Request, Response, Router } from "express";
import { PatientController } from "./patient.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import validateRequest from "../../../middleware/validateRequest";
import { PatientValidation } from "./patient.validation";
import { updateMyPatientProfileMiddleware } from "./patient.utils";

const router = Router();

router.patch("/update-my-profile", authCheck(UserRole.PATIENT), multerUpload.fields([
    { name: "profilePhoto", maxCount: 1},
    { name: "medicalReports", maxCount: 10},
]), 
updateMyPatientProfileMiddleware,
validateRequest(PatientValidation.updatePatientProfileSchema),
PatientController.updateMyProfile);

export const PatientRouter = router;
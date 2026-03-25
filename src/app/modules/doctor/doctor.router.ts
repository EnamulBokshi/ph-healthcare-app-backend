import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import validateRequest from "../../../middleware/validateRequest";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
router.get("/:doctorId", DoctorController.getDoctorById);
router.patch("/:doctorId", validateRequest(updateDoctorZodSchema),DoctorController.updateDoctor);
router.delete("/:doctorId", DoctorController.deleteDoctor);
export const DoctorRouter = router;
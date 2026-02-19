import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getAllDoctors);
// router.post("/create-admin", UserController.createAdmin);
// router.post("/create-superadmin", UserController.createSuperAdmin);

export const DoctorRouter = router;
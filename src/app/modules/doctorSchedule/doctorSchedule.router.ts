import { Router } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import authCheck from "../../../middleware/authCheck";
import { DoctorScheduleController } from "./doctorSchedule.controller";


const router = Router();

router.post("/create-my-doctor-schedule",
    authCheck(UserRole.DOCTOR),
     DoctorScheduleController.createMyDoctorSchedule);
router.get("/my-doctor-schedules", authCheck(UserRole.DOCTOR), DoctorScheduleController.getMyDoctorSchedules);
router.get("/", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorScheduleController.getAllDoctorSchedules);
router.get("/:doctorId/schedule/:scheduleId", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), DoctorScheduleController.getDoctorScheduleById);
router.patch("/update-my-doctor-schedule",
    authCheck(UserRole.DOCTOR),
    DoctorScheduleController.updateMyDoctorSchedule);
router.delete("/delete-my-doctor-schedule/:id", authCheck(UserRole.DOCTOR), DoctorScheduleController.deleteMyDoctorSchedule);

export const DoctorScheduleRoutes = router;
import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router";
import { UserRouter } from "../modules/user/user.router";
import { DoctorRouter } from "../modules/doctor/doctor.router";
import { AdminRouter } from "../modules/admin/admin.router";
import { scheduleRoutes } from "../modules/schedule/schedule.router";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.router";
import { SpecialtyRouter } from "../modules/speciality/specialty.router";
import { AppointmentRoutes } from "../modules/appointment/appointment.router";
import { PatientRouter } from "../modules/patient/patient.router";

const router: Router = Router();

router.use("/specialities", SpecialtyRouter);

router.use("/auth", authRouter);
router.use("/users", UserRouter);
router.use("/doctors", DoctorRouter);
router.use("/admins", AdminRouter);
router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
router.use("/appointments", AppointmentRoutes)
router.use("/patients", PatientRouter);
export const IndexRouter = router;
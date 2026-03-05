import { Router } from "express";
// import { SpecialtyRouter } from "../modules/specialty/specialty.router";
import { authRouter } from "../modules/auth/auth.router";
import { UserRouter } from "../modules/user/user.router";
import { DoctorRouter } from "../modules/doctor/doctor.router";
import { AdminRouter } from "../modules/admin/admin.router";
import { scheduleRoutes } from "../modules/schedule/schedule.router";
import { DoctorScheduleRoutes } from "../modules/doctorSchedule/doctorSchedule.router";

const router: Router = Router();

// router.use("/specialities", SpecialtyRouter);

router.use("/auth", authRouter);
router.use("/users", UserRouter);
router.use("/doctors", DoctorRouter);
router.use("/admins", AdminRouter);
router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
// router.use("/appointments", AppointmentRoutes)

export const IndexRouter = router;
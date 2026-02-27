import { Router } from "express";
import { SpecialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";
import { UserRouter } from "../modules/user/user.router";
import { DoctorRouter } from "../modules/doctor/doctor.router";
import { AdminRouter } from "../modules/admin/admin.router";

const router: Router = Router();

router.use("/specialities", SpecialityRouter);

router.use("/auth", authRouter);
router.use("/users", UserRouter);
router.use("/doctors", DoctorRouter);
router.use("/admins", AdminRouter);


export const IndexRouter = router;
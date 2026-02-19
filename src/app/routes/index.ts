import { Router } from "express";
import { SpecialityRouter } from "../modules/speciality/speciality.router";
import { authRouter } from "../modules/auth/auth.router";

const router: Router = Router();

router.use("/specialities", SpecialityRouter);

router.use("/auth", authRouter);

export const IndexRouter = router;
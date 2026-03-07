import { Router } from "express";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";
import { StatsController } from "./stats.controller";


const router = Router();



router.get("/", authCheck(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT), StatsController.getDashboardStats);

export const StatsRouter = router;
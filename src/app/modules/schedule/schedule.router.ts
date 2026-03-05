import { Router } from "express";
import { ScheduleValidation } from "./schedule.validation";
import { UserRole } from "../../../generated/prisma/enums";
import authCheck from "../../../middleware/authCheck";
import validateRequest from "../../../middleware/validateRequest";
import { ScheduleController } from "./schedule.controller";

const router = Router();

router.post('/', authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), validateRequest(ScheduleValidation.createScheduleZodSchema) , ScheduleController.createSchedule);
router.get('/', authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), ScheduleController.getAllSchedules);
router.get('/:id', authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR), ScheduleController.getScheduleById);
router.patch('/:id', authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN),validateRequest(ScheduleValidation.updateScheduleZodSchema), ScheduleController.updateSchedule);
router.delete('/:id', authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), ScheduleController.deleteSchedule);

export const scheduleRoutes = router;
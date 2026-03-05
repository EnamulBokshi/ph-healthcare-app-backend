import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import authCheck from "../../../middleware/authCheck";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/book-appointment", authCheck(UserRole.PATIENT), AppointmentController.bookAppointment);
router.get("/my-appointments", authCheck(UserRole.PATIENT, UserRole.DOCTOR), AppointmentController.getMyAppointments);
router.patch("/change-appointment-status/:id", authCheck(UserRole.PATIENT, UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),AppointmentController.changeAppointmentStatus);
router.get("/my-single-appointment/:id", authCheck(UserRole.PATIENT, UserRole.DOCTOR), AppointmentController.getMySingleAppointment);
router.get("/all-appointments", authCheck(UserRole.ADMIN, UserRole.SUPER_ADMIN), AppointmentController.getAllAppointments);
router.post("/book-appointment-with-pay-later", authCheck(UserRole.PATIENT), AppointmentController.bookAppointmentWithPayLater);
router.post("/initiate-payment/:id", authCheck(UserRole.PATIENT), AppointmentController.initiatePayment);

export const AppointmentRoutes = router;
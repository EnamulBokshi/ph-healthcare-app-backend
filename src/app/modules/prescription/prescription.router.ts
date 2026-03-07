import express from 'express';
import { PrescriptionValidation } from './prescription.validation';
import { UserRole } from '../../../generated/prisma/enums';
import authCheck from '../../../middleware/authCheck';
import { PrescriptionController } from './prescription.controller';
import validateRequest from '../../../middleware/validateRequest';

const router = express.Router();

router.get(
    '/',
    authCheck(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    PrescriptionController.getAllPrescriptions
);

router.get(
    '/my-prescriptions',
    authCheck(UserRole.PATIENT, UserRole.DOCTOR),
    PrescriptionController.myPrescriptions
)

router.post(
    '/',
    authCheck(UserRole.DOCTOR),
    validateRequest(PrescriptionValidation.createPrescriptionZodSchema),
    PrescriptionController.givePrescription
)

router.patch(
    '/:id',
    authCheck(UserRole.DOCTOR),
    validateRequest(PrescriptionValidation.updatePrescriptionZodSchema),
    PrescriptionController.updatePrescription
)

router.delete(
    '/:id',
    authCheck(UserRole.DOCTOR),
    PrescriptionController.deletePrescription
)


export const PrescriptionRoutes = router;
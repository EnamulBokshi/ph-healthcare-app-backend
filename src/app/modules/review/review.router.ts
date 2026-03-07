import express from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { ReviewController } from './review.controller';
import authCheck from '../../../middleware/authCheck';
import validateRequest from '../../../middleware/validateRequest';
import { ReviewValidation } from './review.validation';

const router = express.Router();

router.get('/', ReviewController.getAllReviews);

router.post(
    '/',
    authCheck(UserRole.PATIENT),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.giveReview
);

router.get('/my-reviews', authCheck(UserRole.PATIENT, UserRole.DOCTOR), ReviewController.myReviews);

router.patch('/:id', authCheck(UserRole.PATIENT), validateRequest(ReviewValidation.updateReviewZodSchema), ReviewController.updateReview);

router.delete('/:id', authCheck(UserRole.PATIENT), ReviewController.deleteReview);




export const ReviewRoutes = router;
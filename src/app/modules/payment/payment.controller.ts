import { Request, Response } from "express";
import catchAsync from "../../helpers/catchAsync";
import { env } from "../../../config/env";
import { stripe } from "../../../config/stripe.config";
import { PaymentService } from "./payment.service";
import { sendResponse } from "../../helpers/sendResponse";

const handleStripeWebhookEvent = catchAsync( async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = env.STRIPE.WEBHOOK_SECRET;

    if(!signature || !webhookSecret) {
        return res.status(400).json({ success: false, message: 'Missing signature or webhook secret' });
    }
    
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err:any) {
        console.error('Error verifying Stripe webhook signature:', err);
        return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    try {
        const result = await PaymentService.handlerStripeWebhookEvent(event);
        sendResponse(res, {
            
            success: true,
            httpStatusCode: 200,
            message: result.message
        });
        
    } catch (error:any) {
        console.error('Error handling Stripe webhook event:', error);
        sendResponse(res, {
            success: false,
            httpStatusCode: 500,
            message: 'Internal server error'
        });
    }
});

export const PaymentController = {
    handleStripeWebhookEvent
}
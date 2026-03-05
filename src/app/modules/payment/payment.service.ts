import Stripe from 'stripe';
import prisma from '../../lib/prisma';
import { PaymentStatus } from '../../../generated/prisma/enums';

const handleStripeWebhookEvent = async(event: Stripe.Event) => {
    const existingEvent = await prisma.payment.findFirst({
        where: {
            stripeEventId: event.id
        }
    });
    
    if(existingEvent){
        console.log(`Event with ID ${event.id} has already been processed.`);
        return { success: true, message: 'Event already processed' };
    }

    switch(event.type){
        case 'checkout.session.completed':
            {
                const session = event.data.object as Stripe.Checkout.Session;
                const appointmentId = session.metadata?.appointmentId;

                const paymentId = session.metadata?.paymentId;
                if (!appointmentId || !paymentId) {
                    console.error('Missing appointmentId or paymentId in session metadata');
                    return { success: false, message: 'Missing metadata' };
                }

                const appointment = await prisma.appointment.findUnique({
                    where: { id: appointmentId }
                });

                if (!appointment) {
                    console.error(`Appointment with ID ${appointmentId} not found`);
                    return { success: false, message: 'Appointment not found' };
                }
                
                await prisma.$transaction(async (tx) => {
                    await tx.appointment.update({
                        where: { id: appointmentId },
                        data: { paymentStatus: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID }
                    })
                    await tx.payment.update({
                        where: { id: paymentId },
                        data: {
                            stripeEventId: event.id,
                            status: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID,
                            paymentGateWayData: session as any,
                        }
                    });

                });
                console.log(`Payment for appointment ID ${appointmentId} updated successfully based on Stripe event ${event.id}`);
                return { success: true, message: 'Payment status updated successfully' };
                break;
            }
        case 'checkout.session.expired':
            {
                const session = event.data.object 

            console.log(`Checkout session expired for session ID ${session.id}`);

            break;
        }
            
        case 'payment_intent.payment_failed':
            { 
            const session = event.data.object;
            console.log(`Payment intent failed for payment intent ID ${session.id}`);
            break;
            }
        
        default:
            console.log(`Unhandled event type: ${event.type}`);

    }

    return { success: true, message: 'Event processed successfully' };
}

export const PaymentService = {
    handleStripeWebhookEvent
}
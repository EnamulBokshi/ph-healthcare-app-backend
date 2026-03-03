
import z, { xid } from "zod";

const createSpecialityZodSchema = z.object({
    title: z.string('Title must be a string').min(1, 'Title is required'),
    description: z.string('Description must be a string').min(1, 'Description is required').optional()
})


export const SpecialityValidation = {
    createSpecialityZodSchema
}
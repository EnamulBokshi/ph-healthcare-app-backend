import z from "zod";
import { BloodGroup, Gender } from "../../../generated/prisma/enums";




const updatePatientProfileSchema = z.object({
    patientInfo:  z.object({
        name: z.string("Name must be a string").min(1, "Name cannot be empty").max(100, "Name cannot exceed 100 characters").optional(),
        profilePhoto: z.url("Profile photo must be a string").optional(),
        contactNumber: z.string("Contact number must be a string").min(1, "Contact number cannot be empty").max(20, "Contact number cannot exceed 20 characters").optional(),
        address: z.string("Address must be a string").min(1, "Address cannot be empty").max(200, "Address cannot exceed 200 characters").optional(),
    }).optional(),
    patientHealthData: z.object({
        gender: z.enum([Gender.FEMALE, Gender.MALE, Gender.OTHER], "Gender must be one of 'FEMALE', 'MALE', or 'OTHER'").optional(),
        dateOfBirth: z.string("Date of birth must be a string in ISO format").refine((date) => !isNaN(Date.parse(date)), "Date of birth must be a valid date").optional(),
        bloodGroup: z.enum([BloodGroup.A_NEGATIVE, BloodGroup.A_POSITIVE, BloodGroup.B_NEGATIVE, BloodGroup.B_POSITIVE, BloodGroup.O_NEGATIVE, BloodGroup.O_POSITIVE, BloodGroup.AB_NEGATIVE, BloodGroup.AB_POSITIVE], "Blood group must be a valid blood group").optional(),
        hasAllergies: z.boolean("Has allergies must be a boolean").optional(),
        hasDiabetes: z.boolean("Has diabetes must be a boolean").optional(),
        height: z.string("Height must be a string").optional(),
        weight: z.string("Weight must be a string").optional(),
        smokingStatus: z.boolean("Smoking status must be a boolean").optional(),
        dietaryPreferences: z.string("Dietary preferences must be a string").optional(),
        pregnancyStatus: z.boolean("Pregnancy status must be a boolean").optional(),
        mentalHealthHistory: z.string("Mental health history must be a string").optional(),
        immunizationStatus: z.string("Immunization status must be a string").optional(),
        hasPastSurgeries: z.boolean("Has past surgeries must be a boolean").optional(),
        recentAnxiety: z.boolean("Recent anxiety must be a boolean").optional(),
        recentDepression: z.boolean("Recent depression must be a boolean").optional(),
        maritalStatus: z.string("Marital status must be a string").optional(),
    }).optional(),
    medicalReports: z.array(z.object({
        reportName: z.string("Report name must be a string").min(1, "Report name cannot be empty").max(100, "Report name cannot exceed 100 characters").optional(),
        reportLink: z.url("Report link must be a string").optional(),
        shouldDelete: z.boolean("Should delete must be a boolean").optional(),
        reportId: z.string("Report ID must be a string").min(1, "Report ID cannot be empty").max(100, "Report ID cannot exceed 100 characters").optional(),
    })).refine((reports)=> {
        if(!reports || reports.length === 0) return true; // If no reports, it's valid
        
        for(const report of reports){
            if(report.shouldDelete && !report.reportId){
                return false; // If shouldDelete is true, reportId must be provided
            }
            else if(report.reportId && !report.shouldDelete){
                return false; // If reportId is provided, shouldDelete must be true
            }
            else if(report.reportName && !report.reportLink){
                return false; // If reportName is provided, reportLink must be provided
            }
            else if(report.reportLink && !report.reportName){
                return false; 
            }
            else{
                return true;
            }
        }
    }, {
        message: "Each medical report must have either both reportName and reportLink or neither, and if shouldDelete is true, reportId must be provided"
    }).optional(),
})

export  const PatientValidation = {
    updatePatientProfileSchema
}
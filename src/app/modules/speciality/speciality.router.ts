import { Router } from "express";
import { SpecialityController } from "./speciality.controller";

const router:Router = Router();


router.post("/", SpecialityController.createSpeciality)
router.get("/", SpecialityController.getAllSpecialities)
router.delete("/:specialityId", SpecialityController.deleteSpeciality)
router.patch("/:specialityId", SpecialityController.updateSpeciality)
export const SpecialityRouter = router;
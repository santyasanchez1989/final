import { Router } from "express";
import { AdoptionsController } from "../controllers/adoptions.controller.js";
import { UserServices } from "../services/user.services.js";
import { PetServices } from "../services/pet.services.js";

const userServices = new UserServices();  
const petServices = new PetServices();    
const adoptionsController = new AdoptionsController(userServices, petServices);  

const router = Router();


router.get("/", adoptionsController.getAllAdoptions);    
router.get("/:aid", adoptionsController.getAdoption);    
router.post("/:uid/:pid", adoptionsController.createAdoption);  

export default router;
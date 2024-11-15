import { Router } from "express";
import { AdoptionsController } from "../controllers/adoptions.controller.js";
import { UserServices } from "../services/user.services.js";
import { PetServices } from "../services/pet.services.js";
import { AdoptionServices } from "../services/adoption.services.js";

const userServices = new UserServices();
const petServices = new PetServices();
const adoptionServices = new AdoptionServices();
const adoptionsController = new AdoptionsController(userServices, petServices, adoptionServices);

const router = Router();

router.post("/:uid/:pid", adoptionsController.createAdoption);  // Ruta para crear adopción

export default router;
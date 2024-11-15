import AdoptionDTO from "../dto/Adoption.dto.js";
import { UserServices } from "../services/user.services.js";
import { PetServices } from "../services/pet.services.js";
import { AdoptionServices } from "../services/adoption.services.js";

export class AdoptionsController {
  constructor(userServices, petServices) {
    this.adoptionsService = new AdoptionServices();
    this.usersService = userServices;  
    this.petsService = petServices;    
  }

  getAllAdoptions = async (req, res, next) => {
    try {
      const result = await this.adoptionsService.getAll();
      res.status(200).send({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  };

  getAdoption = async (req, res, next) => {
    try {
      const adoptionId = req.params.aid;
      const adoption = await this.adoptionsService.getById(adoptionId);
      if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" });
      res.status(200).send({ status: "success", payload: adoption });
    } catch (error) {
      next(error);
    }
  };

  createAdoption = async (req, res, next) => {
    try {
      const { uid, pid } = req.params;
      const user = await this.usersService.getById(uid);
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });

      const pet = await this.petsService.getById(pid);
      if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
      if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet already adopted" });

      
      user.pets.push(pet._id);
      await this.usersService.update(uid, { pets: user.pets });

     
      await this.petsService.update(pid, { adopted: true, owner: user._id });

      
      const adoption = await this.adoptionsService.create({ owner: user._id, pet: pet._id });
      res.status(201).send({ status: "success", message: "Pet adopted", payload: adoption });
    } catch (error) {
      next(error);
    }
  };
}
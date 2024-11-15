import { UserServices } from "../services/user.services.js";
import { PetServices } from "../services/pet.services.js";
import { AdoptionServices } from "../services/adoption.services.js";

export class AdoptionsController {
  constructor(userServices, petServices, adoptionsService) {
    this.adoptionsService = adoptionsService;
    this.usersService = userServices;
    this.petsService = petServices;
  }

  createAdoption = async (req, res) => {
    try {
      const { uid, pid } = req.params;

      // Verificar si el usuario y la mascota existen
      const user = await this.usersService.getById(uid);
      if (!user) return res.status(404).send({ status: "error", message: "User not found" });

      const pet = await this.petsService.getById(pid);
      if (!pet) return res.status(404).send({ status: "error", message: "Pet not found" });

      // Verificar si la mascota ya está adoptada
      if (pet.adopted) return res.status(400).send({ status: "error", message: "Pet already adopted" });

      // Actualizar la mascota y el usuario
      user.pets.push(pet._id);
      await this.usersService.update(uid, { pets: user.pets });
      await this.petsService.update(pid, { adopted: true, owner: user._id });

      // Crear la adopción
      const adoption = { owner: user._id, pet: pet._id, adoptedAt: new Date() };

      // Devolver la adopción
      return res.status(201).send({ status: "success", message: "Pet adopted successfully", payload: adoption });
    } catch (error) {
      return res.status(500).send({ status: "error", message: "Internal server error" });
    }
  };
}
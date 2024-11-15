import { UserServices } from "../services/user.services.js";
import { PetServices } from "../services/pet.services.js";
import { AdoptionServices } from "../services/adoption.services.js";

export class AdoptionsController {
  constructor(userServices, petServices, adoptionsService) {
    this.adoptionsService = adoptionsService;
    this.usersService = userServices;
    this.petsService = petServices;
  }

  // Método para crear una adopción
  createAdoption = async (req, res) => {
    try {
      const { uid, pid } = req.params;

      // Verificar si el usuario existe
      const user = await this.usersService.getById(uid);
      if (!user) {
        return res.status(404).send({ status: "error", message: "User not found" });
      }

      // Verificar si la mascota existe
      const pet = await this.petsService.getById(pid);
      if (!pet) {
        return res.status(404).send({ status: "error", message: "Pet not found" });
      }

      // Verificar si la mascota ya ha sido adoptada
      if (pet.adopted) {
        return res.status(400).send({ status: "error", message: "Pet already adopted" });
      }

      // Asociar la mascota con el usuario
      user.pets.push(pet._id);
      await this.usersService.update(uid, { pets: user.pets });

      // Marcar la mascota como adoptada
      await this.petsService.update(pid, { adopted: true, owner: user._id });

      // Crear la adopción usando el servicio de adopción
      const adoptionData = { owner: user._id, pet: pet._id, adoptedAt: new Date() };
      const adoption = await this.adoptionsService.create(adoptionData);

      // Obtener la adopción con los detalles completos de la mascota y el dueño
      const adoptionWithDetails = await this.adoptionsService.getById(adoption._id)
        .populate('pet')  // Incluye los detalles de la mascota
        .populate('owner'); // Incluye los detalles del dueño

      return res.status(201).send({
        status: "success",
        message: "Pet adopted successfully",
        payload: {
          adoptionId: adoptionWithDetails._id,
          pet: adoptionWithDetails.pet,  // La mascota ahora tiene los detalles completos
          owner: adoptionWithDetails.owner,
          adoptedAt: adoptionWithDetails.adoptedAt
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: "error", message: "Internal server error" });
    }
  };
}
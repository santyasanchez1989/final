import { Router } from "express";
import { UserControllers } from "../controllers/users.controller.js"; // Verifica la importación

const router = Router();
const userControllers = new UserControllers(); // Asegúrate de que se instancie el controlador correctamente

router.post("/", userControllers.createUser);  // Usamos POST para crear un usuario
router.get("/", userControllers.getAllUsers);  // Método para obtener todos los usuarios
router.get("/mock", userControllers.createUserMock);  // Método para crear usuarios de prueba
router.get("/:uid", userControllers.getUser);  // Método para obtener un usuario por ID
router.put("/:uid", userControllers.updateUser);  // Método para actualizar un usuario
router.delete("/:uid", userControllers.deleteUser);  // Método para eliminar un usuario


export default router;  
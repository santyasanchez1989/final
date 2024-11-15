import { Router } from "express";
import { UserControllers } from "../controllers/users.controller.js"; // Verifica la importación

const router = Router();
const userControllers = new UserControllers(); 

router.post("/", userControllers.createUser);  
router.get("/", userControllers.getAllUsers);  
router.get("/mock", userControllers.createUserMock);  
router.get("/:uid", userControllers.getUser);  
router.put("/:uid", userControllers.updateUser);  
router.delete("/:uid", userControllers.deleteUser);  


export default router;  
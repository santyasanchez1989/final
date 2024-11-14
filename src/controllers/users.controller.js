import { Router } from "express";
import { UserServices } from "../services/user.services.js"; 
export class UserControllers {
  constructor() {
    this.userServices = new UserServices(); 
  }

  
  createUserMock = async (req, res) => {
    const users = await this.userServices.createMocks();
    res.status(201).json({ status: "ok", users });
  };

  
  createUser = async (req, res, next) => {
    try {
      const userData = req.body;  
      
      const newUser = await this.userServices.create(userData);

      
      res.status(201).json({ status: "ok", user: newUser });
    } catch (error) {
      next(error);  
    }
  };

  
  getAllUsers = async (req, res, next) => {
    try {
      const users = await this.userServices.getAll();
      res.send({ status: "success", payload: users });
    } catch (error) {
      next(error);
    }
  };

  
  getUser = async (req, res, next) => {
    try {
      const userId = req.params.uid;
      const user = await this.userServices.getById(userId);
      res.send({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  };

 
  updateUser = async (req, res) => {
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await this.userServices.getById(userId);
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });

    await this.userServices.update(userId, updateBody);
    res.send({ status: "success", message: "User updated" });
  };

  deleteUser = async (req, res) => {
    const userId = req.params.uid;
    await this.userServices.remove(userId);
    res.send({ status: "success", message: "User deleted" });
  };
}
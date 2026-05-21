import express from "express";
import {
    getUsers,
    createUser,
    updateUser,
    deleterUser,
} from '../controllers/user.controller.js';
const router = express.Router();
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleterUser);
export default router;

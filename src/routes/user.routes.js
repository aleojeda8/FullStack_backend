import express from 'express';
import {getUsers,createUser,updateUser,deleteUser,requestEdit,} from '../controllers/user.controller.js';
import { authMiddlewere } from '../middlewares/auth.middleware.js';
import { authorizeRoles} from '../middlewares/role.middleware.js';

const router = express.Router();

router.get("/users",authMiddlewere,authorizeRoles('ROOT','ADMIN', 'USER', 'GUEST'), getUsers);
router.post("/users",authMiddlewere,authorizeRoles('ROOT','ADMIN'), createUser);
router.put("/users/:id",authMiddlewere,authorizeRoles('ROOT','ADMIN'), updateUser);
router.delete("/users/:id",authMiddlewere,authorizeRoles('ROOT','ADMIN'), deleteUser);
router.post("/users/request-edit", authMiddlewere, requestEdit);
// router.get("/users", getUsers);
// router.post("/users", createUser);
// router.put("/users/:id",updateUser);
// router.delete("/users/:id", deleteUser);

export default router;
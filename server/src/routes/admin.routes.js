import { Router } from "express";
import { registerAdmin } from "../controllers/admin.controller.js";
import { adminLogin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/register").post(registerAdmin) 
router.route("/login").post(adminLogin) 

export default router;
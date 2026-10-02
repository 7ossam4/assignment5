import { Router } from "express";
import * as userService from "./user.service.js";

const router = Router();

router.post("/signup", userService.signup);
router.get("/by-email", userService.getUserByEmail); // must be before /:id
router.put("/:id", userService.createOrUpdateUser);
router.get("/:id", userService.getUserById);

export default router;

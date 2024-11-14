import { Router } from "express";
import { create_issues, get_issues } from "../controllers/issuesController.js";

const router = Router()
 
router.route("/")
    .post(create_issues)
    .get(get_issues)

export default router
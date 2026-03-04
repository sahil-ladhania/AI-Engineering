import { Router } from "express";
import { getPersonas } from "./personas.controller";
import { authorize } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authorize);

router.get("/", getPersonas);

export default router;

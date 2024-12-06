import express from "express";

import { saveCategory,ListMetaCard } from "../controllers/superAdminController/superAdmin.js";
const router = express.Router();

router.post('/saveCategory',saveCategory)
router.get('/listMetaCard',ListMetaCard)




export default router;
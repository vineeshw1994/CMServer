import express from "express";

import { saveCategory,ListMetaCard,saveData,getCategoryColumn } from "../controllers/superAdminController/superAdmin.js";
const router = express.Router();

router.post('/saveCategory',saveCategory)
router.get('/listMetaCard',ListMetaCard)
router.post('/saveData',saveData)
router.get('/getCategoryColumns/:id',getCategoryColumn)




export default router;
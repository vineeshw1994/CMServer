import express from "express";

import { saveCategory,ListMetaCard,saveData,getCategoryColumn,listColumns,saveColumnName } from "../controllers/superAdminController/superAdmin.js";
const router = express.Router();

router.post('/saveCategory',saveCategory)
router.get('/listMetaCard',ListMetaCard)
router.post('/saveData',saveData)
router.get('/getCategoryColumns/:id',getCategoryColumn)

router.get('/columnList',listColumns)
router.post('/saveColumnName',saveColumnName)


export default router;
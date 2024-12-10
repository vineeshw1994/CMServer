import express from "express";

import { saveCategory,ListMetaCard,saveData,getCategoryColumn,listColumns,saveColumnName,updateMetadata
    ,listMetaData,getCategoryData,saveColumnData
 } from "../controllers/superAdminController/superAdmin.js";
const router = express.Router();

router.post('/saveCategory',saveCategory)
router.get('/listMetaCard',ListMetaCard)
router.post('/saveData',saveData)
router.get('/getCategoryColumns/:id',getCategoryColumn)

router.get('/columnList',listColumns)
router.post('/updateMetadata',updateMetadata)
router.get('/listMetaData',listMetaData)
router.get('/getCategoryData/:id',getCategoryData)
router.post('/saveColumnName',saveColumnName)
router.post('/saveColumnData',saveColumnData)

export default router;
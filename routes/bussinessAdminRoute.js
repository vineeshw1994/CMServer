import express from "express";
import { categoryDetails, getCategoryList, savingValue } from "../controllers/bussinessAdminController/bussinessAdmin.js";

const router = express.Router();

router.get('/getCategorylist',getCategoryList)
router.get('/getCategoryvalue/:id',categoryDetails)
router.post('/saveValueData',savingValue)

export default router;
import express, { Request, Response, Router } from "express";
import { postEstimations } from "../controllers/estimations/postEstimations";
import {
  getEstimations,
  getEstimationsByID,
} from "../controllers/estimations/getEstimations";
import { putEstimations } from "../controllers/estimations/putEstimations";
import { deleteEstimations } from "../controllers/estimations/deleteEstimations";
import { searchEstimations } from "../controllers/estimations/searchEstimations";
import { uploadEstimations } from "../controllers/estimations/addEstimations";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router: Router = express.Router();
router.post("/estimations", async (req: Request, res: Response) => {
  postEstimations(req, res);
});

router.get("/estimations", async (req: Request, res: Response) => {
  getEstimations(req, res);
});

router.get("/estimations/:name", async (req: Request, res: Response) => {
  getEstimationsByID(req, res);
});

router.put("/estimations", async (req: Request, res: Response) => {
  putEstimations(req, res);
});

router.patch("/estimations", async (req: Request, res: Response) => {
  deleteEstimations(req, res);
});

router.get("/estimations/:search", async (req: Request, res: Response) => {
  searchEstimations(req, res);
});

router.post(
  "/estimationsupload",
  upload.single("csvFile"),
  async (req: Request, res: Response) => {
    uploadEstimations(req, res);
  }
);

export default router;

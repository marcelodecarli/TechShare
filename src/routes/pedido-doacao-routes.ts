import { Router } from "express";
import { PedidoDoacaoController } from "../controllers/pedido-doacao-controller";
import multer from "multer";
import path from "path";

// ─── Configura upload (salva em /uploads) ──────────────────────
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../../uploads"),
  filename: (_, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ─── Router ────────────────────────────────────────────────────
const router = Router();
const itemDoacao = new PedidoDoacaoController();

// ➜ POST /api/pedidos
router.post(
  "/pedidos",
  upload.single("comprovanteEscolar"),      // <input name="comprovanteEscolar">
  itemDoacao.create.bind(itemDoacao)
);

router.get("/pedidos", itemDoacao.getAll.bind(itemDoacao));
router.get("/pedidos/:id", itemDoacao.getById.bind(itemDoacao));
router.patch("/pedidos/:id", itemDoacao.updatePartial.bind(itemDoacao));
router.delete("/pedidos/:id", itemDoacao.delete.bind(itemDoacao));

export default router;

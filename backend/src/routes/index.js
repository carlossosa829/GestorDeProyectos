const router = require("express").Router();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  methods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

//ROUTES
router.options("*", cors(corsOptions));
router.use(cors(corsOptions));
router.use("/alumnos", require("./alumnos"));
router.use("/carreras", require("./carreras"));
router.use("/usuarios", require("./usuarios"));
router.use("/", require("./login"));

module.exports = router;

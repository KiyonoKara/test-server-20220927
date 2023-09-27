import express from "express";
import path from "path";

const router = express.Router();

router.get("/", (request, response) => {
    response.sendFile(path.resolve() + "/index.html");
});

router.get("/page2", (request, response) => {
    response.sendFile(path.resolve() + "/page2.html");
});

export default router;

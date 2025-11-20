import express from "express";
import bookings from "./bookings.js";
import exportRouter from "./export.js";
import payments from "./payments.js";
import properties from "./properties.js";
import users from "./users.js";

const router = express.Router();

// combine all sub-admin routes
router.use(users);
router.use(properties);
router.use(bookings);
router.use(payments);
router.use(exportRouter);

export default router;
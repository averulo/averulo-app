import fs from "fs";
import multer from "multer";
import path from "path";

// Directory for uploads
const uploadDir = "uploads/kyc";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.sub}-${Date.now()}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image uploads are allowed"), false);
  } else {
    cb(null, true);
  }
};

// Export instance
export const kycUpload = multer({ storage, fileFilter });
// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../upload"); // local uploads folder
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + "-" + Math.round(Math.random() * 1e5) + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// export default upload;

import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;

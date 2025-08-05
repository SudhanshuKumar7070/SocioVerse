import multer from "multer";
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "./Public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + id +path.extname(file.originalname));
  },
});
export const upload = multer({ storage: storage });
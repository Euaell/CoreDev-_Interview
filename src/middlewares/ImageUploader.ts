import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Set The Storage Engine to temporary storage
const storage = multer.diskStorage({
	  destination: path.join(__dirname, '../public/uploads'),
	  filename: (req, file, cb) => {
		    crypto.pseudoRandomBytes(16, (err, raw) => {
			      cb(null, raw.toString('hex') + path.extname(file.originalname));
		    });
	  }
})

const tmpStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
	  const filetypes = /jpeg|jpg|png|gif/;
	  const mimetype = filetypes.test(file.mimetype);
	  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	  if (mimetype && extname) {
		    return cb(null, true);
	  }
	  cb('Error: File upload only supports the following filetypes - ' + filetypes);
}

export const ImageUpload = multer({
	// storage: storage,
	storage: tmpStorage,
	fileFilter: fileFilter,
	limits: { fileSize: 3000000 } // 3MB
})

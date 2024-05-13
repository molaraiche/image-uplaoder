const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Change the details here with your cloudinary details

cloudinary.config({
  cloud_name: YOUR_CLOUDINARY_NAME,
  api_key: YOUR_CLOUDINARY_API,
  api_secret: YOUR_CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    let folderName = 'Portfolio';

    if (req.route.path.includes('/blog')) {
      folderName = 'Portfolio/Blog';
    } else if (req.route.path.includes('/projects')) {
      if (file.fieldname === 'thumbnail') {
        folderName = 'Portfolio/Projects/Thumbnails';
      } else if (file.fieldname === 'pictures') {
        folderName = 'Portfolio/Projects/Pictures';
      }
    }

    return {
      folder: folderName,
      allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    };
  },
});

const fileUploadLimits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// To manage the uploader from here you need to set the name as how your model is in model.js ( for the specefic file), with the maxcount stuff depend on what u need

const upload = multer({
  storage: cloudinaryStorage,
  limits: fileUploadLimits,
  fileFilter: fileFilter,
}).fields([
  { name: 'pictures', maxCount: 5 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'blogImage', maxCount: 1 },
]);

module.exports = { upload };

const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});
module.exports = upload;
/*const AWS = require('../config/aws.S3.connect');
const multerS3 = require('multer-s3');
const S3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `images/${Date.now().toString()}-${file.originalname}`);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

module.exports = upload;*/

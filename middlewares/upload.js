const multer = require('multer');
const path = require('path');
const uploadManager = require('../helpers/uploadManager');

const fileSize = {
    'image': 1024 * 1024 * 5, // 5MB
    'video': 1024 * 1024 * 20, // 20MB
    'document' : 1024 * 1024 * 10 // 10MB
};

const allowedTypes = {
    'image': ['jpg', 'jpeg', 'png', 'gif'],
    'video': ['mp4', 'avi', 'mkv'],
    'document': ['json', 'txt']
};

// Storage should be replaced by multer-s3 to upload directly to AWS S3
// disk storage for testing purposes
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const uploadFile = (fileType, numberOfFiles, allowedTypes) => {
    return multer({
        storage: storage,
        fileFilter: uploadManager.fileFilter(allowedTypes),
        limits: uploadManager.setLimit(numberOfFiles, fileSize[fileType])
    });
}

exports.uploadSingleFile = (fileType, fieldName) => {
    return uploadFile(fileType, 1, allowedTypes[fileType]).single(fieldName);
}

exports.uploadMultipleFiles = (fileType, numberOfFiles, fieldName) => {
    return uploadFile(fileType, numberOfFiles, allowedTypes[fileType]).array(fieldName, numberOfFiles);
}

exports.uploadMultipleFields = (files) => {
    const { types, numberOfFiles, fields } = uploadManager.handleMultipleFields(files, allowedTypes);

    return uploadFile(undefined, numberOfFiles, types).fields(fields);
}
const multer = require('multer');
const path = require('path');
// Storage should be replaced by multer-s3 to upload directly to AWS S3
/*
    const S3 = new AWS.S3();
    const storage = multerS3({
            s3: S3,
            bucket: 'bucket-name',
            acl: 'public-read',
            metadata: (req, file, cb) => {
                cb(null, { fieldName: file.fieldname });
            },
            key: (req, file, cb) => {
                cb(null, Date.now().toString());
            }
        });
*/
// disk storage for testing purposes
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        checkFileType(file, allowedTypes, cb);
    }
}

const setLimit = (fileType, numberOfFiles) => {
    const limit = {
        'image': 1024 * 1024 * 5, // 5MB
        'video': 1024 * 1024 * 20, // 20MB
        'document' : 1024 * 1024 * 10 // 10MB
    }
    return {
        files: numberOfFiles || 1,
        fileSize: limit[fileType] || 1024 * 1024 * 5 // 5MB
    }
}

const checkFileType = (file, allowedTypes, cb) => {
    const fileTypes = allowedTypes.map(type => new RegExp(type));
    const extName = fileTypes.some(fileType => fileType.test(path.extname(file.originalname).toLowerCase()));
    const mimeType = fileTypes.some(fileType => fileType.test(file.mimetype));
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error(`Error: Only ${allowedTypes.join(', ')} files are allowed!`));
    }
}

const uploadFile = (fileType, numberOfFiles, allowedTypes) => {
    return multer({
        storage: storage,
        fileFilter: fileFilter(allowedTypes),
        limits: setLimit(fileType, numberOfFiles)
    });
}

const allowedTypes = {
    'image': ['jpg', 'jpeg', 'png', 'gif'],
    'video': ['mp4', 'avi', 'mkv'],
    'document': ['json', 'txt']
}

exports.uploadSingleFile = (fileType, fieldName) => {
    return uploadFile(fileType, 1, allowedTypes[fileType]).single(fieldName);
}

exports.uploadMultipleFiles = (fileType, numberOfFiles, fieldName) => {
    return uploadFile(fileType, numberOfFiles, allowedTypes[fileType]).array(fieldName, numberOfFiles);
}

exports.uploadMultipleFields = (files) => {
    let types = [];
    let numberOfFiles = 0;
    let fields = files.map(file => {
        types = types.concat(allowedTypes[file.type]);
        numberOfFiles += file.maxCount;
        return { name: file.name, maxCount: file.maxCount };
    });

    return uploadFile(undefined, numberOfFiles, types).fields(fields);
}
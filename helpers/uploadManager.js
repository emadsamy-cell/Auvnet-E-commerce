const path = require('path');

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

exports.fileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        checkFileType(file, allowedTypes, cb);
    }
}

exports.setLimit = (numberOfFiles, fileSize) => {
    return {
        files: numberOfFiles || 1,
        fileSize: fileSize || 1024 * 1024 * 5 // 5MB
    }
}

exports.handleMultipleFields = (files, allowedTypes) => {
    let types = [];
    let numberOfFiles = 0;

    let fields = files.map(file => {
        types = types.concat(allowedTypes[file.type]);
        numberOfFiles += file.maxCount;
        return { name: file.name, maxCount: file.maxCount };
    });

    return {
        types,
        numberOfFiles,
        fields
    };
}
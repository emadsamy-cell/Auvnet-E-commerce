const validSize = 15;
const invalidSize = -1;
const validPage = 1;
const invalidPage = -1;

exports.vendorToken;
exports.userToken;
exports.adminToken;
exports.inValidToken = "invalid Token";
exports.rootCategory = "67004abaf4190d0a92bff48f";
exports.firstLevelSubCategory = "67004abcf4190d0a92bff493";
exports.secondLevelSubCategory = "67004abef4190d0a92bff49f";
exports.inCorrectCategory = "66fc2f92b2b32df9febd4f64";
exports.invalidCategory = "invalid Category";

// ____________________________________Get All Categories____________________________________
exports.validGetAllCategories = {
    size: validSize,
    page: validPage
}

exports.invalidSizeGetAllCategories = {
    size: invalidSize,
    page: validPage
}

exports.invalidPageGetAllCategories = {
    size: validSize,
    page: invalidPage
}

// ____________________________________Create Category____________________________________
exports.missingNameCreateCategory = {
    parent: null
}

exports.missingParentCreateCategory = {
    name: "Test Category"
}

exports.invalidParentCreateCategory = {
    name: "Test Category",
    parent: "Invalid Parent"
}

exports.invalidNameCreateCategory = {
    name: null,
    parent: null
}

exports.validCreateCategory = {
    name: "Test Category",
    parent: null
}

exports.validCreateSubCategory = {
    name: "Test Sub Category",
    parent: exports.rootCategory
}

exports.validCreateSubSubCategory= {
    name: "Test Sub Sub Category",
    parent: exports.firstLevelSubCategory
}

exports.invalidDepthCreateCategory = {
    name: "Test Category",
    parent: exports.secondLevelSubCategory
}

exports.parentNotFound = {
    name: "Test Sub Category",
    parent: exports.inCorrectCategory
}

// ____________________________________Update Category____________________________________
exports.missingNameUpdateCategory = {
}

exports.validUpdateCategory = {
    name: "Updated Category"
}


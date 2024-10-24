exports.inValidToken = "Bearer inValidToken";
exports.vendorID = "67001816f138d890379fb060";
exports.tempVendorID = "67001816f138d890379fb061";
exports.adminToken;
exports.superAdminToken;
exports.vendorToken;
exports.userToken;
exports.tempVendorToken;
exports.collectionID = "670678a289942bb3019afceb";
exports.deletedCollectionID = "670586afa1d35b395a083af1";
exports.inCorrectCollectionID = "670586afa1d35b395a083a00"
exports.invalidCollectionID = "123";

const validSize = 10;
const invalidSize = 0;
const validPage = 1;
const invalidPage = 0;
const invalidID = '123';
const validProductID1 = "670668a59671a0e993a027be";
const validProductID2 = "6706671dd977a98a8e16f4fd";
const invalidProductID = "123";
const tempProductID = "6706c303f20016d794b2bfdd"
const deleteProductID = "6706c44977978231eddff8f2"

// ______________________________________Validation ______________________________________
exports.inValidSize = {
    size: invalidSize
};

exports.inValidPage = {
    page: invalidPage
};

exports.invalidVendorID = {
    vendor: invalidID
};

exports.validParams = {
    size: validSize,
    page: validPage
};

exports.validParamsWithVendor = {
    size: validSize,
    page: validPage,
    vendor: exports.vendorID
};


// ______________________________________ِAdd Products______________________________
exports.validAddProducts = {
    collections: [
        this.collectionID
    ],
    products: [
        validProductID1,
        validProductID2
    ]
}

exports.invalidAddProducts = {
    collections: [
        this.collectionID
    ],
    products: [
        invalidProductID
    ]
}

exports.deletedProductsAddProducts = {
    collections: [
        this.collectionID
    ],
    products: [
        deleteProductID
    ]
}

exports.tempAddProducts = {
    collections: [
        this.collectionID
    ],
    products: [
        tempProductID
    ]
}

exports.invalidAddProductsCollection = {
    collections: [
        this.invalidCollectionID
    ],
    products: [
        validProductID1,
        validProductID2
    ]
}

exports.inCorrectCollectionAddProducts = {
    collections: [
        this.inCorrectCollectionID
    ],
    products: [
        validProductID1
    ]
}

exports.deletedCollectionAddProduct = {
    collections: [
        this.deletedCollectionID
    ],
    products: [
        validProductID1
    ]
}

// ______________________________________ِRemove Products______________________________
exports.validRemoveProducts = {
    products: [
        validProductID1
    ]
}

exports.invalidRemoveProducts = {
    products: [
        invalidProductID
    ]
}

exports.deletedProductsRemoveProducts = {
    products: [
        deleteProductID
    ]
}

exports.tempRemoveProducts = {
    products: [
        tempProductID
    ]
}
const supertest = require("supertest");
const app = require("../../app");
const data = require('./collection.data')
const tokenManager = require('../../helpers/tokenManager');
const path = require('path');
const { visibility } = require('../../enums/collection');
const roles = require('../../enums/roles')

beforeAll(async () => {
    jest.setTimeout(() => {}, 10000);
    data.superAdminToken = tokenManager.generateAccessToken({_id: 5, role: "superAdmin"});
    data.adminToken = tokenManager.generateAccessToken({_id: 1, role: "admin"});
    data.vendorToken = tokenManager.generateAccessToken({_id: data.vendorID, role: "vendor"});
    data.userToken = tokenManager.generateAccessToken({_id: 3, role: "user"});
    data.tempVendorToken = tokenManager.generateAccessToken({_id: data.tempVendorID, role: "vendor"});
});

const validateCollectionsOwnerShip =  (collections, role, vendorID) => {
    collections.forEach(collection => {
        if(role === roles.VENDOR && collection.vendor) {
            expect(collection.vendor._id).toBe(vendorID);
        }
    });
}

const validateProducts = (options, products, role) => {
    products.forEach(product => {
        let isValidProductWithFilter = (options.availability || options.minPrice || options.maxPrice ? false : true)
        product.productDetails.forEach(variant => {
            let isAvailable = variant.quantity > 0 ? true : false;
            let isMinPrice = variant.price * 1 >= options.minPrice * 1 ? true : false;
            let isMaxPrice = variant.price * 1 >= options.maxPrice * 1 ? true : false;
            if ((!options.availability || isAvailable) && (!options.minPrice || isMinPrice) && (!options.maxPrice || isMaxPrice)) {
                isValidProductWithFilter = true;
            } 
        })
        
        if (!isValidProductWithFilter) {
            expect(isValidProductWithFilter).toBe(true);
        }

        if (options.category) {
            expect(product.category._id).toBe(options.category);
        }

        if (options.name) {
            let regex = new RegExp(options.name, 'i');
            expect(product.name).toMatch(regex)
        }

        if (role === roles.USER && product.isRestored) {
            expect(product.isRestored).toBe(false);
        }
    })
}

// Collection Crud Operations
describe("___Get Collections___", () => {
    // validation [page, size, vendor]
    // auth [user, vendor, admin, superAdmin]
    // vendor only see his collections [public, hidden and Restored]
    // admin see all collections [public, hidden, notRestored and Restored]
    // users can see all collections [public and notRestored]
    // superAdmin can see all collections [public, hidden, Restored, notRestored]
    // when vendor is provided should return all collection for that vendor
    
    // Validation
    it("should return status 400 when size in parameter is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidSize);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when page in parameter is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidPage);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when vendorID in parameter is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.invalidVendorID);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .query(data.validParams);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .query(data.validParams);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // When the request from vendor
    it("should return status 200 with only collection belongs to that vendor", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.tempVendorToken}`)
        .query(data.validParamsWithVendor);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollectionsOwnerShip(response.body.data.collections, roles.VENDOR, data.tempVendorID);
    });

    it("should return status 200 with only collection belongs to that vendor", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .query(data.validParamsWithVendor);


        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollectionsOwnerShip(response.body.data.collections, roles.VENDOR, data.vendorID);
    });


    // when request from user
    it("should return status 200 with all collection that public and its vendor available", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validParams);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
    });

    it("should return status 200 with all collection to specific vendor that public and its vendor available", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validParamsWithVendor);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
    });

    // when request from admin
    it("should return status 200 with all collection that public and hidden", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .query(data.validParams);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
    });

    // When request from super admin
    it("should return status 200 with all collection to specific vendor (Restored or not) that public and hidden", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .query(data.validParamsWithVendor);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
    });
});

describe("___Get Products Collection___", () => {
    // Validation [name, availability, category, maxPrice, minPrice]
    // params [collectionID]
    // Auth [user, vendor, admin or superAdmin]
    it("should return status 400 when name in parameter is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidName);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when availability in parameter is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidAvailability);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when category in parameter is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidCategory);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when maxPrice in parameter is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidMaxPrice);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when minPrice in parameter is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.inValidMinPrice);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when collectionID in url is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.invalidCollectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Not Found
    it("should return status 404 when collection not found", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.inCorrectCollectionID}/products`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    // Vendor Request
    // vendor can see only his collections (public, hidden, Restored) and filter its products (Restored or not)
    it("should return status 403 When not the owner trying to view the collection", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.tempVendorToken}`)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are not authorized to view this collection');
    });

    it("should return status 200 when the collection belongs to that vendor", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .query(data.validAvailabilityFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        expect(response.body.data.vendor).toBe(data.vendorID);
    });

    it("should return status 200 when the collection belongs to that vendor and collection is hidden", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.hiddenCollectionID}/products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)


        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        expect(response.body.data.vendor).toBe(data.vendorID);
    });

    it("should return status 200 when the collection belongs to that vendor and collection is Restored", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.hiddenCollectionID}/products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)


        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        expect(response.body.data.vendor).toBe(data.vendorID);
    });


    // when request from user
    // user can see any collection (public) and filter its products (not Restored ones)
    it("should return status 404 when collection is hidden", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.hiddenCollectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection is deleted", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.deletedCollectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 200 when collection is public", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
    });

    it("should return status 200 with all products available", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validAvailabilityFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        validateProducts(data.validAvailabilityFilter, response.body.data.products, roles.USER);
    });

    it("should return status 200 with all products with specific category", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validCategoryFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        validateProducts(data.validCategoryFilter, response.body.data.products, roles.USER);
    });

    it("should return status 200 with all products with similar name", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validNameFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        validateProducts(data.validNameFilter, response.body.data.products, roles.USER);
    });

    it("should return status 200 with all products with minimum price", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validMinPriceFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        validateProducts(data.validMinPriceFilter, response.body.data.products, roles.USER);
    });

    it("should return status 200 with all products with maximum price", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validMaxPriceFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        validateProducts(data.validMaxPriceFilter, response.body.data.products, roles.USER);
    });

    it("should return status 200 with all products with minimum price and available", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validMinPriceAvailabilityFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        validateProducts(data.validMinPriceAvailabilityFilter, response.body.data.products, roles.USER);
    });

    it("should return status 200 with empty product list when minimum price is greater than maximum price", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.emptyProductsFilter)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
        expect(response.body.data.products.length).toBe(0)
    });

    // when request from admin
    // admin or super admin can see all collections (public, hidden, deleted) and filter it products (deleted or not)
    it("should return status 200 when collection is hidden", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.hiddenCollectionID}/products`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
    });

    it("should return status 200 when collection is deleted", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.deletedCollectionID}/products`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
    });

    it("should return status 200 when collection is public", async () => {
        const response = await supertest(app)
        .get(`/v1/collection/${data.collectionID}/products`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Collection has been found!');
    });
});

describe("___Create Collection___", () => {
    // validation [name, banner]
    it("should return status 400 when name is missing", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when name is invalid", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', '')

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 500 when upload too many images", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'good')

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Too many files");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to create collection", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.userToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Admin trying to create collection", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when super admin trying to create collection", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 200 when Vendor trying to create collection", async () => {
        const response = await supertest(app).post("/v1/collection/create")
        .set("Authorization", `Bearer ${data.tempVendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Collection has been created successfully");
    });
});

describe("__Update Collection___", () => {
    // validation [name, banner]
    it("should return status 400 when name is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', '')

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when visibility is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('visibility', 'invalid')

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when collectionID is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.invalidCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'good')

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 500 when upload too many images", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'good')

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Too many files");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to update collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Admin trying to update collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when super admin trying to update collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when not the owner trying to update collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.tempVendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are not authorized to update this collection');
    });

    it("should return status 404 when collection not found", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is deleted!');
    });

    it("should return status 200 when the owner update existing collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/update/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('banner', path.join(__dirname, '../../test.png'))
        .field('name', 'Test Collection')
        .field('visibility', visibility.PUBLIC)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been updated successfully");
    });
});

describe("__Add Products___", () => {
   // validation [collections, products]
    it("should return status 400 when Collection is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.invalidCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when products are invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.invalidAddProducts)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to Remove Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Admin trying to Remove Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when super admin trying to Remove Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when not the owner of collection trying to Remove Products", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validAddProducts)
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when not the owner of products trying to Remove his collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.tempAddProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Products not found or delete.");
    });

    it("should return status 404 when collection is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is deleted!');
    });

    it("should return status 404 when one or more product is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.deletedProductsAddProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Products not found or delete.");
    });

    it("should return status 200 when the owner update existing collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Products Added Successfully");
    });
});

describe("__Remove Products___", () => {
   // validation [collections, products]
    it("should return status 400 when Collection is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.invalidCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when products are invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.invalidRemoveProducts)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to Remove Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Admin trying to Remove Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when super admin trying to Remove Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when not the owner of collection trying to Remove Products", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validRemoveProducts)
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is deleted!');
    });

    it("should return status 200 when the owner update existing collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Products removed successfully");
    });
});

describe("___Delete Collection___", () => {
    // params [collectionID]
    // Auth [user, vendor, admin or superAdmin]
    it("should return status 400 when collectionID in url is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.invalidCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.collectionID}`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor Request
    // vendor delete only his collections (public, hidden)
    it("should return status 403 When not the owner trying to delete the collection", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.tempVendorToken}`)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are not authorized to delete this collection');
    });

    it("should return status 404 when collection Not Found", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection already deleted", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is already deleted!');
    });

    it("should return status 200 when the collection belongs to that vendor and its public", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been deleted successfully");
    
        await supertest(app)
        .patch(`/v1/collection/restore/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
    });

    it("should return status 200 when the collection belongs to that vendor and its hidden", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.hiddenCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been deleted successfully");
    
        await supertest(app)
        .patch(`/v1/collection/restore/${data.hiddenCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
    });

    // when request from user
    // Not Allowed To Delete any collection
    it("should return status 403 when User trying to delete collection", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // when request from admin
    // admin or super admin can delete all collections (public, hidden)
    it("should return status 404 when collection Not Found", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection already deleted", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is already deleted!');
    });

    it("should return status 200 when collection is hidden", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.hiddenCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been deleted successfully");
    
        await supertest(app)
        .patch(`/v1/collection/restore/${data.hiddenCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
    });

    it("should return status 200 when collection is public", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/delete/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been deleted successfully");
    
        await supertest(app)
        .patch(`/v1/collection/restore/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
    });
});

describe("___Restore Collection___", () => {
    // params [collectionID]
    // Auth [user, vendor, admin or superAdmin]
    it("should return status 400 when collectionID in url is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.invalidCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.collectionID}`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    // Vendor Request
    // vendor delete only his collections (public, hidden)
    it("should return status 403 When not the owner trying to delete the collection", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.tempVendorToken}`)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('You are not authorized to restore this collection');
    });

    it("should return status 404 when collection Not Found", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection not deleted", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is not deleted!');
    });

    it("should return status 200 when the collection belongs to that vendor", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been restored successfully");
    
        await supertest(app)
        .patch(`/v1/collection/delete/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
    });

    // when request from user
    // Not Allowed To Delete any collection
    it("should return status 403 when User trying to delete collection", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.userToken}`)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    // when request from admin
    // admin or super admin can delete all collections (public, hidden)
    it("should return status 404 when collection Not Found", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.inCorrectCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Collection not found");
    });

    it("should return status 404 when collection not deleted", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is not deleted!');
    });

    it("should return status 200 when collection is deleted", async () => {
        const response = await supertest(app)
        .patch(`/v1/collection/restore/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been restored successfully");
    
        await supertest(app)
        .patch(`/v1/collection/delete/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
    });
});

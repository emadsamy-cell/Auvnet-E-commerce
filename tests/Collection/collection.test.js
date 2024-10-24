const supertest = require("supertest");
const app = require("../../app");
const data = require('./collection.data')
const tokenManager = require('../../helpers/tokenManager');
const path = require('path');

beforeAll(async () => {
    jest.setTimeout(() => {}, 10000);
    data.superAdminToken = tokenManager.generateAccessToken({_id: 5, role: "superAdmin"});
    data.adminToken = tokenManager.generateAccessToken({_id: 1, role: "admin"});
    data.vendorToken = tokenManager.generateAccessToken({_id: data.vendorID, role: "vendor"});
    data.userToken = tokenManager.generateAccessToken({_id: 3, role: "user"});
    data.tempVendorToken = tokenManager.generateAccessToken({_id: data.tempVendorID, role: "vendor"});
});

const validateCollections =  (collections, role, vendorID) => {
    collections.forEach(collection => {
        if (role === 'user') {
            expect(collection.isDeleted).toBe(false);
            expect(collection.vendor.status).toBe('active');
            expect(collection.vendor.isDeleted).toBe(false);
        }

        if (role === 'vendor' && collection.vendor._id.toString() !== vendorID.toString()) {
            console.log(collection, vendorID);
        }

        if(role === 'vendor') {
            expect(collection.vendor._id).toBe(vendorID);
        }
    });
}

// Collection Crud Operations
describe("___Get Collections___", () => {
    // validation [page, size, vendor]
    // auth [user, vendor, admin, superAdmin]
    // vendor only see his collections [public, hidden and deleted]
    // admin see all collections [public, hidden, notDeleted and deleted]
    // users can see all collections [public and notDeleted]
    // superAdmin can see all collections [public, hidden, deleted, notDeleted]
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
        validateCollections(response.body.data.collections, 'vendor', data.tempVendorID);
    });

    it("should return status 200 with only collection belongs to that vendor", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .query(data.validParamsWithVendor);


        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollections(response.body.data.collections, 'vendor', data.vendorID);
    });


    // when request from user
    it("should return status 200 with all collection that public and its vendor available", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validParams);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollections(response.body.data.collections, 'user');
    });

    it("should return status 200 with all collection to specific vendor that public and its vendor available", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validParamsWithVendor);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollections(response.body.data.collections, 'user');
    });

    // when request from admin
    it("should return status 200 with all collection that public and hidden", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .query(data.validParams);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollections(response.body.data.collections, 'admin');
    });

    // When request from super admin
    it("should return status 200 with all collection to specific vendor (deleted or not) that public and hidden", async () => {
        const response = await supertest(app)
        .get("/v1/collection/all")
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .query(data.validParamsWithVendor);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("collections has been found!");
        validateCollections(response.body.data.collections, 'admin');
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
        .field('visibility', 'public')

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Collection has been updated successfully");
    });
});

describe("__Add Products___", () => {
   // validation [collections, products]
    it("should return status 400 when collections are invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.invalidAddProductsCollection)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when products are invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.invalidAddProducts)

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    // Auth
    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .send(data.validAddProducts)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to Add Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Admin trying to Add Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when super admin trying to Add Products to collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.superAdminToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when not the owner of collection trying to Add Products", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.inCorrectCollectionAddProducts)
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('There are one ore more collection not found');
    });

    it("should return status 404 when not the owner of products trying to Add his collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.tempVendorToken}`)
        .send(data.validAddProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Products not found or delete.");
    });

    it("should return status 404 when one or more collection is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.deletedCollectionAddProduct)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('There are one ore more collection not found');
    });

    it("should return status 404 when one or more product is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.deletedProductsAddProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Products not found or delete.");
    });

    it("should return status 200 when the owner update existing collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/add-products`)
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

    it("should return status 404 when not the owner of products trying to Remove his collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.tempRemoveProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Products not found or delete.");
    });

    it("should return status 404 when collection is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.deletedCollectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('This collection is deleted!');
    });

    it("should return status 404 when one or more product is deleted", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.deletedProductsRemoveProducts)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Products not found or delete.");
    });

    it("should return status 200 when the owner update existing collection", async () => {
        const response = await supertest(app).patch(`/v1/collection/remove-products/${data.collectionID}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validRemoveProducts)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Products removed successfully");
    });
});



const supertest = require("supertest");
const app = require("../../app");
const data = require('./category.data')
const tokenManager = require('../../helpers/tokenManager');

beforeAll(async () => {
    data.adminToken = tokenManager.generateAccessToken({id: 1, role: "admin"});
    data.vendorToken = tokenManager.generateAccessToken({id: 2, role: "vendor"});
    data.userToken = tokenManager.generateAccessToken({id: 3, role: "user"});
});

// Category Crud Operations
describe("___Get Categories___", () => {
    it("should return status 400 when size in parameter is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.invalidSizeGetAllCategories);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when page in parameter is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.invalidPageGetAllCategories);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .query(data.validGetAllCategories);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .query(data.validGetAllCategories);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 200 when user gets all categories and subcategories", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .set("Authorization", `Bearer ${data.userToken}`)
        .query(data.validGetAllCategories);

        // save token for next test
        data.accessToken = response.body.data.token;

        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Categories has been found!"); 
    });

    it("should return status 200 when vendor gets all categories and subcategories", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .query(data.validGetAllCategories);

        // save token for next test
        data.accessToken = response.body.data.token;

        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Categories has been found!"); 
    });

    it("should return status 200 when admin gets all categories and subcategories", async () => {
        const response = await supertest(app)
        .get("/v1/category/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .query(data.validGetAllCategories);

        // save token for next test
        data.accessToken = response.body.data.token;

        expect(response.status).toBe(200); 
        expect(response.body.message).toBe("Categories has been found!"); 
    });
});

describe("___Create Category___", () => {
    it("should return status 400 when Parent category is missing", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.missingParentCreateCategory);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Category name is missing", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.missingNameCreateCategory);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when Parent category is invalid", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.invalidParentCreateCategory);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .send(data.validCreateCategory);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validCreateCategory);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to create category", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.userToken}`)
        .send(data.validCreateCategory);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Vendor trying to create category", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validCreateCategory);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when Parent is provided but not found", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.parentNotFound);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Parent Category not found or deleted");
    });

    it("should return status 422 when category is exceeding maximum level", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.invalidDepthCreateCategory);

        expect(response.status).toBe(422);
        expect(response.body.message).toBe("Category reached the limit of multi-level hierarchy");
    });
   
    it("should return status 201 when Category is the root", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validCreateCategory);

        expect(response.status).toBe(201); 
        expect(response.body.message).toBe("Category has been created successfully"); 
    });

    it("should return status 201 when Category is subcategory", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validCreateSubCategory);

        expect(response.status).toBe(201); 
        expect(response.body.message).toBe("Category has been created successfully"); 
    });

    it("should return status 201 when Category is Sub Sub Category", async () => {
        const response = await supertest(app)
        .post("/v1/category/create/")
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validCreateSubSubCategory);

        expect(response.status).toBe(201); 
        expect(response.body.message).toBe("Category has been created successfully"); 
    });
});

describe("__Update Category___", () => {
    it("should return status 400 when missing category name", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.missingNameCreateCategory);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 400 when category id is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.invalidCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.rootCategory}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.inValidToken}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to update category", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.userToken}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Vendor trying to update category", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.vendorToken}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when category is not found", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.inCorrectCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Category not found");
    });

    it("should return status 200 when category is updated", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/update/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`)
        .send(data.validUpdateCategory);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Category has been updated successfully");
    });
});

describe("___Delete Category___", () => {
    it("should return status 400 when category id is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.invalidCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.rootCategory}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.inValidToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to delete category", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Vendor trying to delete category", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.vendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when category is not found", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.inCorrectCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Category not found");
    });

    it("should return status 204 when category and its subcategories are deleted", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/delete/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(204);
    });
});

describe("___Restore Category___", () => {
    it("should return status 400 when category id is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.invalidCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.message).toBe("validation error");
    });

    it("should return status 401 when Token is missing", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.rootCategory}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 401 when Token is invalid", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.inValidToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid Authorization Token !");
    });

    it("should return status 403 when User trying to restore category", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.userToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 403 when Vendor trying to restore category", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.vendorToken}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not allowed to perform this action !");
    });

    it("should return status 404 when category is not found", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.inCorrectCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Category not found");
    });

    it("should return status 422 when category is deleted and wanted to restore subcategory", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.firstLevelSubCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(422);
        expect(response.body.message).toBe("Subcategory can't be restored as the category is deleted!");
    });

    it("should return status 200 when category is restored", async () => {
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.rootCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Category has been restored and its subcategories");
    });

    it("should return status 200 when subCategory is restored and Category isn't deleted", async () => {
        // Delete subcategory
        await supertest(app).patch(`/v1/category/delete/${data.firstLevelSubCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        // Restore subcategory
        const response = await supertest(app)
        .patch(`/v1/category/restore/${data.firstLevelSubCategory}`)
        .set("Authorization", `Bearer ${data.adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Category has been restored and its subcategories");
    });
});


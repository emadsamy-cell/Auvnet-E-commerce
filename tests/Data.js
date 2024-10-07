// ____________________ Admin Data _____________________________
exports.validMasterToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGU3NDg1OGMzNmM4NzlkMTZmMmIiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyQWRtaW4iLCJtYXN0ZXIiOnRydWUsImlhdCI6MTcyNzg3MjgwNiwiZXhwIjoxNzI3OTAxNjA2fQ.XSNxdMof2cAxjX6lDfyKb9zAJupd1QQMUSrEswDwt3k";
exports.permaSuperAdminId = "66f96cc72cecfcdbd45b48b4"
exports.validAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGU3NDg1OGMzNmM4NzlkMTZmMmIiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyQWRtaW4iLCJtYXN0ZXIiOnRydWUsImlhdCI6MTcyODIyODAzMSwiZXhwIjoxNzI4MjU2ODMxfQ.zVihS0TtziYibqKCQ6ZWuvqWohUdHT5Lmd0EY8IIhuQ"
exports.validSuperAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGY2NjE2ZmQwMjI5YzQxZWQ3ZDMiLCJ1c2VyTmFtZSI6ImFkbWluMyIsInJvbGUiOiJzdXBlckFkbWluIiwibWFzdGVyIjpmYWxzZSwiaWF0IjoxNzI3NjIzNDM2LCJleHAiOjE3MzAyMTU0MzZ9.6cOQNljb_yNQGoXgTiXqdB1ErKCGvlOElUK9FvVJRvM"
exports.invalidAdminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY0MTE4ZjM4MWE4OTcyZThmNGRjOTMiLCJ1c2VyTmFtZSI6ImFkbWluMiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzI3Mjc2OSwiZXhwIjoxNzI5ODY0NzY5fQ.p74QsQlN-I5IUQ-hPe_CTDxK8LoVm6zSPiUK0TvObis";

exports.existedAdminUserName = "admin3";
exports.notExistedAdminUserName = "notExistAdmin";
exports.existedAdminEmail = "ahmed.essam7722@gmail.com";


exports.validAdminProfileData = {
    userName: "admin3",
    email: "admin3@gmail.com",
    phoneNumber: "+201115377974"
}

exports.loginAdminDataWithInvalidUserName = {
    userName: "notExistAdmin",
    password: "admin",
}
exports.loginAdminDataWithInvalidPassword = {
    userName: "admin",
    password: "admin123",
}
exports.validAdminLoginData = {
    userName: "admin",
    password: "admin",
}

exports.knownAdminOTP = { value: 123456, expiresAt: Date.now() + 300000 }
exports.token = "sample_token";

// ____________________ Coupon Data _____________________________
module.exports = {
    //Tokens
    validToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmY5NGU3NDg1OGMzNmM4NzlkMTZmMmIiLCJ1c2VyTmFtZSI6ImFkbWluIiwicm9sZSI6InN1cGVyQWRtaW4iLCJtYXN0ZXIiOnRydWUsImlhdCI6MTcyNzgwNDM3MCwiZXhwIjoxNzI3ODMzMTcwfQ.TGAvAnP-aHRA-UB94D5d6ESkByHGLC9k2roDU3Z3ogE",
    invalidToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZhZmQ2N2UxZmNhNWI2ZGI1MWRlMzgiLCJ1c2VyTmFtZSI6ImFobWVkLmVzc2FtNzcyMiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI3ODA0NDk3LCJleHAiOjE3Mjc4MzMyOTd9.ODbEdgoLv-adDGi-ZmNX4IvyxPlx3_fRcFcVvsH3JMk",
    validUserToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZjODIyMDFlZmVlOTllZjM2ZTM4OWMiLCJ1c2VyTmFtZSI6Im1vaGFtZWRoYXNzYW4xIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjgyNDE0MDcsImV4cCI6MTcyODI3MDIwN30.6vjyLL_WwU9zqNdRTv3UXaT-8OUnqYDzsMKQq9voCz0",
    validVendorToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmZjNGM1NzhkYjAzMjE4N2Q1MTU4ZDMiLCJ1c2VyTmFtZSI6InZlbmRvciIsInJvbGUiOiJ2ZW5kb3IiLCJpYXQiOjE3MjgyMjcxNDksImV4cCI6MTcyODI1NTk0OX0.r0wZ_Y9FQHWwuZkQGiwPUiujZViFJuAeZ2SlmDY0H70",
    validMasterToken: this.validAdminToken,
    
    //Users Ids
    vendorId: "66fc4c578db032187d5158d3",
    
    //Coupons
    validVendorCoupon: "66fc561edcbf215e8bfb22bd",
    inValidVendorCoupon: "66fd28eece3cd1af2be99be0",
    validUserTargetCoupon: "66fc6060cdf75ee917142362",
    invalidUserTargetCoupon: "66fd28eece3cd1af2be99be0",
    globalCoupon: "66fc561edcbf215e8bfb22bd",
    adminCouponId: "66fc5674dcbf215e8bfb22c2",
    validVendorCoupon: "66fc561edcbf215e8bfb22bd",
    anotherVendorCoupon: "66fd28eece3cd1af2be99be4",
    usedCouponId: "66fedfe25a0f834d9fbe82fa",
    finishedCouponId: "66fecf4386cd65695e27d5ef",
    expiredCouponId: "66fef251f18de9c333df08d2",
    validCouponId: "66fd28eece3cd1af2be99be0",
    deletedCouponId: "66fee10e0f9d64012c694f01",
    couponBody: {
        code: "summer2122",
        discountType: "purchase",
        discountValue: 20,
        expireAt: "2024-12-02",
        couponUsage: {
            type: "limited",
            count: 100
        },
        userUsage: {
            type: "limited",
            count: 1
        },
        termsAndConditions: {
            minPurchaseValue: 50,
            maxDiscountLimit: 100,
            audienceLocation: {
                type: "country",
                location: "egypt"
            }
        },
    },

    //Products
    deletedProductId: "6702b6f669aef4e8397b1974",
    unOwnedProduct: "6702a393ea24f11c340deee9",
    productId: "6702a393ea24f11c340deefb",

    //Category
    deletedCategoryId: "67023e9fa677718a4a283f42",
    categoryId: "67023e9fa677718a4a283f41",
    
};


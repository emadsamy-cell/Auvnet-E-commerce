const Coupon = require("./coupon.model");

// Create methods
const create = async (data) => {
  const newCoupon = await Coupon.create(data);
  if (!newCoupon) {
    return {
      success: false,
      message: "Failed to create coupon",
      statusCode: 400,
      error: "Invalid data provided for the coupon",
    };
  }

  return {
    success: true,
    message: "Coupon is created successfully",
    statusCode: 201,
    data: {
        coupon: newCoupon,
    },
  };
};

// Get methods
const isExist = async (filter, select, populate) => {
  const coupon = await Coupon.findOne(filter).select(select).populate(populate);
  if (!coupon) {
    return {
      success: false,
      message: "Coupon not found",
      statusCode: 404,
      error: "There is no coupon with the provided filter options",
    };
  }

  return {
    success: true,
    message: "Coupon is found",
    statusCode: 200,
    data: coupon
  };
};
const getList = async (filter, select, options, populate) => {
  const [coupons, totalCoupons] = await Promise.all([
    Coupon.find(filter)
      .limit(options.limit)
      .skip(options.skip)
      .select(select)
      .sort(options.sort)
      .populate(populate),
    Coupon.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalCoupons / options.limit);
  return { total: totalCoupons, totalPages, coupons };
};

// Update methods
const update = async (filter, data) => {
  const result = await Coupon.updateOne(filter, data)

  if (!result.modifiedCount) {
    //In case of update with the same data
    const message = result.matchedCount ? "Coupon is updated successfully" : "Coupon not found"
    const statusCode = result.matchedCount ? 200 : 404
    const success = result.matchedCount ? true : false

    return {
      success,
      message,
      statusCode
    }
  }
  return {
    success: true,
    message: "Coupon is updated successfully",
    statusCode: 200
  }
}
const updateAndReturn = async (filter, data, select, options, populate) => {
  const result = await Coupon.findOneAndUpdate(filter, data, options).select(select).populate(populate)

  if (!result) {
    return {
      success: false,
      message: "Failed to update coupon",
      statusCode: 400,
      error: "Coupon not found"
    }
  }
  return {
    success: true,
    message: "Coupon is updated successfully",
    statusCode: 200,
    data: result
  }
}

// Delete methods
const remove = async (filter) => {
  const result = await Coupon.deleteOne(filter)
  if (!result.deletedCount) {
    return {
      success: false,
      message: "Failed to delete coupon",
      statusCode: 400,
      error: "Coupon not found"
    }
  }
  return {
    success: true,
    message: "Coupon is deleted successfully",
    statusCode: 204
  }
}

module.exports = {
  create,
  update,
  isExist,
  updateAndReturn,
  remove,
  getList
};

const Admin = require("./admin.model");

// Create methods
const create = async (data) => {
  const newAdmin = await Admin.create(data);
  if (!newAdmin) {
    return {
      success: false,
      message: "Failed to create admin account",
      statusCode: 400,
    };
  }

  return {
    success: true,
    message: "Admin account created successfully",
    statusCode: 201,
    data: {
      userName: newAdmin.userName,
      email: newAdmin.email,
      phoneNumber: newAdmin.phoneNumber,
    },
  };
};

// Get methods
const isExist = async (filter, select) => {
  const admin = await Admin.findOne(filter).select(select);
  if (!admin) {
    return {
      success: false,
      message: "Admin not found",
      statusCode: 404
    };
  }

  return {
    success: true,
    message: "Admin found",
    statusCode: 200,
    data: admin
  };
};
const getList = async (filter, select, options, populate) => {
  const [admins, totalAdmins] = await Promise.all([
    Admin.find(filter)
      .limit(options.limit)
      .skip(options.skip)
      .select(select)
      .sort(options.sort)
      .populate(populate),
    Admin.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalAdmins / options.limit);
  return { total: totalAdmins, totalPages, admins };
};

// Update methods
const update = async (filter, data) => {
  const result = await Admin.updateOne(filter, data)

  if (!result.modifiedCount) {
    //In case of update with the same data
    const message = result.matchedCount ? "Admin updated successfully" : "Admin not found"
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
    message: "Admin updated successfully",
    statusCode: 200
  }
}
const updateAndReturn = async (filter, data, select, options, populate) => {
  const result = await Admin.findOneAndUpdate(filter, data, options).select(select).populate(populate)

  if (!result) {
    return {
      success: false,
      message: "Failed to update admin",
      statusCode: 400,
      error: "Admin not found"
    }
  }
  return {
    success: true,
    message: "Admin updated successfully",
    statusCode: 200,
    data: result
  }
}

// Delete methods
const remove = async (filter) => {
  const result = await Admin.deleteOne(filter)
  if (!result.deletedCount) {
    return {
      success: false,
      message: "Failed to delete admin",
      statusCode: 400,
      error: "Admin not found"
    }
  }
  return {
    success: true,
    message: "Admin deleted successfully",
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

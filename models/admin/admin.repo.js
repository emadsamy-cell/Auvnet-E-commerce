const Admin = require("./admin.model");

// Create methods
const createAdmin = async ({ data = {} } = {}) => {
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
const isExist = async ({ filter = {}, select = "" } = {}) => {
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

// Update methods
const updateOne = async ({ filter = {}, data = {} } = {}) => {
  const result = await Admin.updateOne(filter, data)

  if(!result.modifiedCount) {
    return {
      success: false,
      message: "Failed to update admin",
      statusCode: 400
    }
  }
  return {
    success: true,
    message: "Admin updated successfully",
    statusCode: 200
  }
}
const findOneAndUpdate = async ({ filter = {}, data = {}, options = {}, select = "", populate = [] } = {}) => {
  const result = await Admin.findOneAndUpdate(filter, data, options).select(select).populate(populate)
  
  if(!result) {
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
const deleteOne = async ({ filter = {} } = {}) => {
  const result = await Admin.deleteOne(filter)
  if(!result.deletedCount){
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
  createAdmin,
  updateOne,
  isExist,
  findOneAndUpdate,
  deleteOne
};

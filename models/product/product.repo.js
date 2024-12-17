const Product = require("./product.model");

/*
    @params filter: object
    @params update: object
    @params populate: object
    @params options: object
    @params select: string
    @params skip: number
    @params limit: number
    @params sort: string
*/

exports.getList = async (filter, select, populate, skip, limit, sort) => {
  try {
    const [products, productCount] = await Promise.all([
      Product.find(filter)
        .select(select)
        .populate(populate)
        .skip(skip)
        .limit(limit)
        .sort(sort),
      Product.countDocuments(filter),
    ]);

    const pages = Math.ceil(productCount / limit);

    return {
      success: true,
      statusCode: 200,
      message: "Products has been found!",
      data: {
        products,
        pages,
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
      error,
    };
  }
};

exports.isExist = async (filter, select, populate) => {
  try {
    const product = await Product.findOne(filter)
      .select(select)
      .populate(populate);
    if (product) {
      return {
        success: true,
        statusCode: 200,
        message: "Product has been found!",
        data: product,
        error: null,
      };
    } else {
      return {
        success: false,
        statusCode: 404,
        message: "Product not found",
        data: null,
        error: `There are no product with this filter ${filter}!!`,
      };
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
      error,
    };
  }
};

exports.create = async (data) => {
  try {
    const product = await Product.create(data);

    return {
      success: true,
      statusCode: 201,
      message: "product has been created successfully",
      data: product,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
      error,
    };
  }
};

exports.updateProduct = async (filter, update, options) => {
  try {
    const result = await Product.updateOne(filter, update, options);

    if (result.matchedCount === 1) {
      return {
        success: true,
        message: "Product has been updated successfully",
        statusCode: 200,
        data: null,
        error: null,
      };
    } else {
      return {
        success: false,
        statusCode: 404,
        message: "Product not found",
        data: null,
        error: `There are no product with this filter ${filter}!!`,
      };
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
      error,
    };
  }
};

exports.deleteProduct = async (filter) => {
  try {
    const result = await Product.deleteOne(filter);

    if (result.deletedCount === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "Product not found",
        data: null,
        error: `There are no product with this filter ${filter}!!`,
      };
    } else {
      return {
        success: true,
        statusCode: 204,
        message: "Product successfully deleted",
        data: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
      error,
    };
  }
};

exports.findAndUpdateProduct = async (
  filter,
  update,
  select,
  populate,
  options
) => {
  const product = await Product.findOneAndUpdate(filter, update, options)
    .select(select)
    .populate(populate);
  if (product) {
    return {
      success: true,
      statusCode: 200,
      message: "Product has been updated successfully",
      data: product,
      error: null,
    };
  } else {
    return {
      success: false,
      status: 404,
      message: "No product has been found",
      data: null,
      error: `There are no product with this filter ${filter}!!`,
    };
  }
};

exports.deleteProducts = async (filter) => {
  try {
    const result = await Product.deleteMany(filter);

    if (result.deletedCount === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "Product not found",
        data: null,
        error: `There are no product with this filter ${filter}!!`,
      };
    } else {
      return {
        success: true,
        statusCode: 204,
        message: "Product successfully deleted",
        data: null,
        error: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: null,
      error,
    };
  }
};

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Data yang dikirim tidak valid.",
          details: error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
          })),
        },
      });
    }

    req[source] = value;

    next();
  };
};

module.exports = validate;
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        uuAppErrorMap: { validationError: error.details[0].message },
      });
    }
    next();
  };
  
  module.exports = validate;
  
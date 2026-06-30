const xss = require("xss");

const sanitizeBody = (req, res, next) => {
  const sanitizeValue = (val) => {
    if (typeof val === "string") {
      return xss(val);
    }

    if (Array.isArray(val)) {
      return val.map(sanitizeValue);
    }

    if (val && typeof val === "object") {
      return Object.fromEntries(
        Object.entries(val).map(([k, v]) => [k, sanitizeValue(v)])
      );
    }

    return val;
  };

  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  next();
};

module.exports = { sanitizeBody };
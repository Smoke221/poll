const requestIp = require("request-ip");

const getLocationMiddleware = (req, res, next) => {
  // Get user's IP address from request headers
  const clientIp = req.clientIp;
//   console.log(`Client IP Address: ${clientIp}`);
  next();
};

module.exports = { getLocationMiddleware };

const auth = require("./authMiddleware");

const authenticateAdmin = async (req, res, next) => {
  await auth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access only" });
    }
    next();
  });
};

module.exports = { authenticateAdmin };

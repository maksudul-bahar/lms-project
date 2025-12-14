module.exports = (req, res, next) => {
  if (req.user.role === "instructor" && !req.user.isApproved) {
    return res.status(403).json({
      error: "Instructor not approved by admin yet"
    });
  }
  next();
};

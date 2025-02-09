export const authorize = (role) => {
  return (req, res, next) => {
    console.log("user authorization middleware", req.user);
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    next();
  };
};

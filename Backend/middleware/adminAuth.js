const jwt = require("jsonwebtoken");

exports.isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userType !== "admin") {
            return res.status(403).json({ error: "Forbidden: Admins only" });
        }
        req.adminId = decoded.adminId;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden. Requires one of roles: ${roles.join(', ')}` });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;

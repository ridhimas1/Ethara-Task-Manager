import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const authorizeRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. User not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden. Requires one of roles: ${roles.join(', ')}` });
    }
    next();
  };
};

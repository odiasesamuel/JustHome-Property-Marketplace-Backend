import { Request, Response, NextFunction } from "express";

export const ifFileUploaded = (...middlewares: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    let index = 0;
    const run = () => {
      const middleware = middlewares[index];
      index++;
      if (!middleware) return next();
      middleware(req, res, (err: any) => {
        if (err) return next(err);
        run();
      });
    };

    run();
  };
};

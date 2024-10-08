import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: IUser;
      files: Express.Multer.File[]
    }
  }
}

export { };

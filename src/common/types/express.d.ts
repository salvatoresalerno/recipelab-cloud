import { CurrentUser } from "./commonTypes";


 

declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser; // Ora req.user sarà di tipo User ovunque
    }
  }
}
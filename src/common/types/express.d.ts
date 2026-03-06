import { CurrentUser } from "./commonTypes";


 

declare global {
  namespace Express {
    interface User extends CurrentUser {}
    interface Request {
      user?: User; // Ora req.user sarà di tipo User ovunque
    }
  }
}
/* declare global {
  namespace Express {
    interface Request {
      user?: CurrentUser; // Ora req.user sarà di tipo User ovunque
    }
  }
} */
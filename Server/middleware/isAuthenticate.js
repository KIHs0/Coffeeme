import { Errhandler } from "../utils/errhandler.js";
import { wrapasync } from "../utils/utility.js";
import jwt from "jsonwebtoken";
export const IsAuthenticated = wrapasync(async (req, res, next) => {
  let token = req.cookies.newToken;
  // console.log(`this is isauthenticated ${token}`);
  if (!token) {
    return next(new Errhandler("you must be login no token found", 403));
  }
  const tokenData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = tokenData;
  next();
});

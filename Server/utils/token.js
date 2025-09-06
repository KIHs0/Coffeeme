import jwt from "jsonwebtoken";
export const Token = (data_id) =>
  jwt.sign({ userid: data_id }, process.env.JWT_SECRET, { expiresIn: "7d" });

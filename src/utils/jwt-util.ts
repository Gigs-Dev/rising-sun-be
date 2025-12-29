import jwt from "jsonwebtoken";


export const signAccessToken = (
  payload: {
    id: string;
    role: string;
    isBanned: boolean;
  },
  privateKey: string
): string => {
  return jwt.sign(payload, privateKey, { expiresIn: "1h" });
};




export const signRefreshToken = (
  payload: {
    id: string;
    role: string;
    isBanned: boolean;
  },
  privateKey: string
): string => {
  return jwt.sign(payload, privateKey, { expiresIn: "14d" });
};


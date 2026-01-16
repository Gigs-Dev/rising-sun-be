import jwt from "jsonwebtoken";


export const signAccessToken = (
  payload: {
    id: string;
    role: string;
    isBanned: boolean;
  },
  privateKey: string
): string => {
  return jwt.sign(payload, privateKey, { expiresIn: "7d" });
};


export const signAdminAccessToken = (
  payload: {
    id: string;
    role: string;
    isBanned: boolean;
  },
  privateKey: string
): string => {
  return jwt.sign(payload, privateKey, { expiresIn: "15m" });
};




export const signAdminRefreshToken = (
  payload: {
    id: string;
    role: string;
    isBanned: boolean;
  },
  privateKey: string
): string => {
  return jwt.sign(payload, privateKey, { expiresIn: "4h" });
};


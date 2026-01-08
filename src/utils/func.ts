import bcrypt from "bcrypt";
import crypto from 'crypto';


export const doHash = (value: string, saltvalue: number) => {
    const result = bcrypt.hash(value, saltvalue);
    return result;
}


export const hashValidator = (value: string, hashedvalue: string) => {
    const result = bcrypt.compare(value, hashedvalue);
    return result;
}


export const hmacHash = (data: string) => {
  const  result = crypto.createHmac('sha256', 'secret-key')
  .update(data)
  .digest('hex');

  return result;
}


export const verifyHmac = (data: string, receivedHash: string): boolean => {
  const expectedHash = hmacHash(data);
  return crypto.timingSafeEqual(
    Buffer.from(expectedHash, 'hex'),
    Buffer.from(receivedHash, 'hex')
  );
};


export const generateVerificationId = (): string => {
  return crypto.randomBytes(32).toString("hex"); // 64 chars
};

export function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}



export function generateReferralCode(email: string): string {
  const prefix = email.slice(0, 3).toUpperCase();

  const randomLetters = Array.from({ length: 3 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");

  const randomDigits = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");

  return `${prefix}-${randomLetters}-${randomDigits}`;
}

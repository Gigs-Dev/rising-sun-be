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


export const generateReferalCode = () => {

}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

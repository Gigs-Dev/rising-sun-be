import { Document } from "mongoose";

export interface UserType  extends Document {
    fullName: string;
    email: string;
    password: string;
    profilePics: string;
    dob: Date;
    address: string;
    referringUserCode: string;
    phoneNumber: string
}


export interface OtpDocument extends Document {
    email: string;
    code: string;
    expiresAt: Date;
}

export interface VerifySignupDTO {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  referringUserCode?: string;
}


export interface SendOtpResult {
  success: boolean;
  message: string;
}

export interface AccountType {

}


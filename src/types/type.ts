import { Document, StringExpressionOperatorReturningArray } from "mongoose";

export interface UserType  extends Document {
    fullName: string;
    verificationId: string;
    email: string;
    password: string;
    profilePics: string;
    dob: Date;
    address: string;
    referringUserCode: string;
    phoneNumber: string;
    isBanned: boolean;
    role?: string;
    tokenVersion?: number;
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
  verificationId;
  referringUserCode?: string;
}


export interface SendOtpResult {
  success: boolean;
  message: string;
}

export interface withdrawalType extends Document {
  userId: any;
  accountId: any;
  amount: number;
  bankSnapshot: {
      acctNum: String;
      bankName: String;
      bankCode: Number;
      accountNumber: Number;
  };
  status: string;
  reference: string;
  approvedBy: any;
  rejectionReason: string;
  flutterwave: any
}


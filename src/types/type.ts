import { Document } from "mongoose";

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


export interface DebitTransactionPayload {
  userId: string;
  amount: number;
  withdrawalPin: string;
  bankCode: string;
  bankName: string;
  accountNum: string;
}


export interface TransactionHistoryParams {
  userId: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}


export interface AdminTransactionQuery {
  status?: string;
  type?: string;
  userId?: string;
  reference?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
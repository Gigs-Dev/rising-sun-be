import { Document } from "mongoose";

export interface UserType  extends Document {
    fullName: string;
    email: string;
    password: string;
    profilePics: string;
    dob: Date;
    address: string;
    referringUserCode: string;
    phoneNumber: number
}


interface OtpDocument extends Document {
    email: string;
    code: string;
    expiresAt: Date;
}




export interface AccountType {

}


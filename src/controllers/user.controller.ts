import { Request, Response } from "express";
import User from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import { doHash, hashValidator } from "../utils/func";
import { UserType } from "../types/type";
import Referrals from "../models/referral.model";
import Account from "../models/account.model";


export const getAllUsers = async (req:Request, res: Response) => {
    
    const users = await User.find().sort({createdAt: -1});

    if(!users || users.length === 0){
        sendResponse(res, 404, false, 'Users not found')
    }
    
    sendResponse(res, 200, true, 'Users fetched successfully!', users)
}


export const getUserDetails = async (req:Request, res: Response) => {

    const user = await User.findById(req.params.id).select(
    'fullName email phoneNumber referringUserCode createdAt dob address'
    );

    if(!user){
        return sendResponse(res, 404, false, 'User does not exist')
    }

    const [referral, account] = await Promise.all([
      Referrals.findOne({ userId: user._id }).lean(),
      Account.findOne({ userId: user._id }).lean(),
    ]);

    sendResponse(res, 200, true, 'User details fetched successfully!', {
      user,
      userDetails: { referral, account },
    })
}



export const updateUserDetails = async (req:Request, res: Response) => {

    const user = await User.findById(req.params.id);

    if (!user) {
      return sendResponse(res, 404, false, 'User does not exist');
    }

        /* -------------------- ALLOWED UPDATES -------------------- */
    const allowedFields: (keyof UserType)[] = [
      'fullName',
      'phoneNumber',
      'dob',
      'address',
      'profilePics'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user.set(field, req.body[field]);
      }
    });

    await user.save();

    sendResponse(res, 200, true, 'Profile updated successfully', {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePics: user.profilePics,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dob: user.dob
    });

};


export const updatePassword = async (req:Request, res:Response) => {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;


    if (!oldPassword || !newPassword) {
      return sendResponse(
        res,
        400,
        false,
        'Old password and new password are required'
      );
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return sendResponse(res, 404, false, 'User does not exist');
    }

    /* -------------------- PASSWORD CHECK -------------------- */
    const isMatch = await hashValidator(oldPassword, user.password);

    if (!isMatch) {
      return sendResponse(res, 401, false, 'Old password is incorrect');
    }

    if (oldPassword === newPassword) {
      return sendResponse(
        res,
        400,
        false,
        'New password must be different from old password'
      );
    }

    /* -------------------- UPDATE -------------------- */
    user.password = newPassword;

    // user.tokenVersion += 1;

    await user.save();

    sendResponse(res, 200, true, 'Password updated successfully');

}



export const getMyReferrals = async (req:Request, res: Response) => {
  const referral = await Referrals.findOne({ userId: req.user.id });

  if (!referral || referral.referrals.length === 0) {
    return sendResponse(res, 200, true, 'No referrals yet', []);
  }

  const users = await User.find({
    _id: { $in: referral.referrals }
  }).select('-password');

  return sendResponse(res, 200, true, 'Referrals fetched', users);
}



export const bannUser = async (req:Request, res: Response) => {
    console.log('coming soon!!!')
}

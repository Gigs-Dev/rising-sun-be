import mongoose from "mongoose";
import Referrals from "../models/referral.model";

class ReferralService {
  /**
   * Create referral profile for a new user
   */
  static async createReferralProfile(
    userId: mongoose.Types.ObjectId,
    email: string,
    session: mongoose.ClientSession
  ) {
    return Referrals.create(
      [
        {
          userId,
          referralCode: email.toLowerCase(),
        },
      ],
      { session }
    );
  }

  /**
   * Reward referrer if referral code was used
   */
  static async rewardReferrer(
    referringUserCode: string,
    newUserEmail: string,
    session: mongoose.ClientSession
  ) {
    const referrer = await Referrals.findOne(
      { referralCode: referringUserCode.toLowerCase() },
      null,
      { session }
    );

    if (!referrer) return null;

    return Referrals.updateOne(
      { _id: referrer._id },
      {
        $addToSet: { referrals: newUserEmail.toLowerCase() },
        $inc: { referralAmt: 500 }, 
      },
      { session }
    );
  }
}

export default ReferralService;

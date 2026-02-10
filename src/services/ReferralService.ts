import mongoose from "mongoose";
import Referrals from "../models/referral.model";
import { generateUniqueReferralCode } from "../utils/gen-referral-code";


class ReferralService {
  /**
   * Create referral profile for a new user
   */
  static async createReferralProfile(
    userId: mongoose.Types.ObjectId,
    email: string,
    session: mongoose.ClientSession
  ) {
    const referralCode = (await generateUniqueReferralCode(email)).toUpperCase();

    const [referral] = await Referrals.create(
      [{ userId, referralCode }],
      { session }
    );

    return referral;
  }

  /**
   * Reward referrer if referral code was used
   */
  static async rewardReferrer(
    referringUserCode: string,
    newUserReferralCode: string,
    session: mongoose.ClientSession
  ) {
    const referrer = await Referrals.findOne(
      { referralCode: referringUserCode.toUpperCase() },
      null,
      { session }
    );

    if (!referrer) return null;

    return Referrals.updateOne(
      {
        _id: referrer._id,
        referrals: { $ne: newUserReferralCode.toUpperCase() }, // prevent double reward
      },
      {
        $addToSet: { referrals: newUserReferralCode.toUpperCase() },
        $inc: { referralAmt: 500 },
      },
      { session }
    );
  }

}

export default ReferralService;

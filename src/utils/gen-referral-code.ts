import Referrals from "../models/referral.model";
import { generateReferralCode } from "../utils/func";

export async function generateUniqueReferralCode(email: string): Promise<string> {
  let referralCode = "";
  let exists = true;

  while (exists) {
    referralCode = generateReferralCode(email);
    exists = !!(await Referrals.exists({ referralCode }));
  }

  return referralCode;
}

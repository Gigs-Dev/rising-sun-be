import Flutterwave from "flutterwave-node-v3";
import { FLW_PUBLIC_KEY, FLW_SECRET_KEY } from "../config/env.config";

const flw = new Flutterwave(FLW_PUBLIC_KEY!, FLW_SECRET_KEY!);

export const verifyFlutterwaveTransaction = async (transactionId: number) => {
  const response = await flw.Transaction.verify({ id: transactionId });
  return response.data;
};

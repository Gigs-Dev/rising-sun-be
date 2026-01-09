import { Request, Response } from "express"
import axios from 'axios';

export const approveWithdrawal = async (req: Request, res: Response) => {

    const { amount, accountNum, bankCode, acctName } = req.body

    const options = {
    method: 'POST',
    url: 'https://api.flutterwave.com/v3/transfers',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X',
        'Content-Type': 'application/json'
    },
    data: {
        account_bank: bankCode,
        account_number: accountNum,
        amount: amount,
        currency: 'NGN',
        debit_subaccount: 'PSA******07974',
        beneficiary: 3768,
        beneficiary_name: acctName,
        reference: 'akhlm-pstmnpyt-rfxx007_PMCKDU_1',
        debit_currency: 'NGN',
        destination_branch_code: 'GH280103',
        callback_url: 'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d',
        narration: 'Akhlm Pstmn Trnsfr xx007'
    }
    };


axios
  .request(options)
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
}
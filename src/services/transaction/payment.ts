const generateUniqueReference = () => {
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 10000)
    return `txn_${timestamp}_${randomSuffix}`
}


const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

export const createWithrawal = async  (account_bank: string, account_number:number, amount: number) => {
    const reference = generateUniqueReference();
    try {
        const details = {
            account_bank,
            account_number,
            amount,
            currency: "NGN",
            narration: "User withdrawal",
            reference,
        };

        const response = await flw.Transfer.initiate(details)

        return response;
    } catch (error) {
        throw new Error()
    }

}

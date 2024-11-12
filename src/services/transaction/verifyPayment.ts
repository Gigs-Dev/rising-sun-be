

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const verifyCredit = async (id: Number) => {
    try{
        const res = await flw.Transaction.verify(id);

        return res;
    } catch(err){
        throw new Error()
    }

}



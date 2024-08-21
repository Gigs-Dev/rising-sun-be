import User from "../../model/user.model";
import { Response, Request } from "express"
import { requestOtp } from "../../services/auth/requestOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";


const register = async (req: Request, res: Response) => {

    try {
        const { email, inputCode } = req.body;

        const otp = await requestOtp(email);
        
        const isOtpValid = verifyOtp(otp, inputCode);

        if (!isOtpValid) return res.status(403).json({ message: 'Otp not valid or has expired' })

        const generatedId = await generateAcctID();
        const generatedReferalId = await generateReferalId(email);

        const newUser = await User.create({
            ...req.body,
            acctId: generatedId,
            referalId: generatedReferalId,
        })
        
        return res.status(201).json({ user: newUser });
        
    } catch (error) {
        handle500Errors(error, res)
    }
    

}


const login = async (req: Request, res: Response) => {

}


export { login, register }

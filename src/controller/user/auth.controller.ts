import User from "../../model/user.model";
import { Response, Request } from "express"
import { requestOtp } from "../../services/auth/requestOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";



const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const otp = await requestOtp(email);
        res.status(200).send({ otp: otp })
    } catch (error) {
        handle500Errors(error, res);
    }
}



const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { email, input } = req.body;


    } catch (error) {
        handle500Errors(error, res);
    }
}



const newUser = async (req: Request, res: Response) => {

    try {
        const { email } = req.body;

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


export { login, newUser, sendOtp, verifyEmail }

import User from "../../model/user.model";
import { Response, Request } from "express"
import { requestOtp } from "../../services/auth/requestOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";
import jwt from 'jsonwebtoken';




const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const otp = await requestOtp({ email });

        res.status(200).json({ otp: otp });
    } catch (error) {
         handle500Errors(error, res)

    }
}



const newUser = async (req: Request, res: Response) => {

    try {

        const { email, inputCode, referalCode } = req.body;
        
        const isOtpValid = await verifyOtp(email, inputCode);

        if (!isOtpValid) return res.status(403).json({ message: 'Otp not valid or has expired' })

        const user = await User.findOne({ email });

        if(!user){

            const generatedId = await generateAcctID();
            const generatedReferalId = await generateReferalId(email);
    
            const newUser = await User.create({
                ...req.body,
                acctType: 'real',
                acctId: generatedId,
                referalId: generatedReferalId,
            })
    
            if (referalCode) {
                await User.updateOne(
                    { referalCode: referalCode },
                    { $push: { referals: newUser._id } }
                );
            }

            const accessToken = jwt.sign({ email: newUser.email, id: newUser._id, isAdmin: newUser.isAdmin }, 'jwtkey', { expiresIn: '1month' });

            const { isAdmin, ...userDetails } = newUser._doc;
            
            return res.status(201).json({ user: userDetails, accessToken });
        } else {

            const accessToken = jwt.sign({email: user.email, id: user._id}, 'jwtkey', {expiresIn: '1month'});

            const { isAdmin, ...userDetails } = user._doc;

            return res.status(200).json({ user: userDetails, accessToken });
        }
        
    } catch (error) {
        handle500Errors(error, res)
    }
    
}



const login = async (req: Request, res: Response) => {
    try {
        const { email, inputCode } = req.body;

        const isVerified = await verifyOtp(email, inputCode);

        if(!isVerified) return res.status(403).json({ message: 'Otp not valid or has expired' });

        const user = await User.findOne({ email });

        res.status(201).json(user);
    } catch (error) {
        handle500Errors(error, res)
    }
}


export { login, newUser, sendOtp }


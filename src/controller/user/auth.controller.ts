import User from "../../model/user.model";
import { Response, Request } from "express"
import { requestOtp, deleteOtp } from "../../services/auth/requestOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";



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
    const session = await mongoose.startSession();
    session.startTransaction();

    const { email, inputCode, referalCode } = req.body;
    try {
        
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
            const referringUser = await User.findOne({ referalId: referalCode });

            if(!referringUser) return res.status(400).json({ msg: 'Invalid referal code' });
                await referringUser.updateOne(
                    { referalId: referalCode },
                    { $push: { referals: newUser._id } }
                );
            }

            const accessToken = jwt.sign({ email: newUser.email, id: newUser._id, isAdmin: newUser.isAdmin }, 'jwtkey', { expiresIn: '15d' });

            const { isAdmin, ...userDetails } = newUser._doc;
            
            return res.status(201).json({ user: userDetails, accessToken });
        } else {

            const accessToken = jwt.sign({email: user.email, id: user._id}, 'jwtkey', {expiresIn: '30d'});

            const { isAdmin, ...userDetails } = user._doc;

            return res.status(200).json({ user: userDetails, accessToken });
        }
        
    } catch (error: any) {
        await session.abortTransaction();
       res.status(500).json(error.message);
        
    } finally {
        session.endSession();
        await deleteOtp(email);
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


import User from "../../model/user.model";
import { Response, Request } from "express"
import { requestOtp, deleteOtp } from "../../services/auth/requestOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";
import jwt from 'jsonwebtoken';




const sendOtp = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const otp = await requestOtp({ email });

        res.sendStatus(200).json({ msg: 'OTP sent seuccessfully!'});
    } catch (error) {
         handle500Errors(error, res)

    }
}



const newUser = async (req: Request, res: Response) => {

    const { email, inputCode, referalCode } = req.body;
    try {

        
        const isOtpValid = await verifyOtp(email, inputCode);

        if (!isOtpValid) return res.status(403).json({ message: 'Otp not valid or has expired' })

        let user = await User.findOne({ email });

        if(!user){

            const generatedId = await generateAcctID();
            const generatedReferalId = await generateReferalId(email);

            let referringUser;
            if (referalCode) {
                referringUser = await User.findOne({ referalId: referalCode });

                if (!referringUser) {
                    return res.status(400).json({ msg: 'Invalid referral code' });
                }

            }

            user = new User({
                ...req.body,
                acctType: 'real',
                acctId: generatedId,
                referalId: generatedReferalId,
                referalCode: referringUser ? referringUser.referalId : null,
            })

            await Promise.all([user.save(), referringUser?.updateOne({ $push: { referals: user._id } })])

            // await user.save();

            // await referringUser?.updateOne(
            //     { $push: { referals: user._id } }
            // );

            const accessToken = jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, 'jwtkey', { expiresIn: '7d' });

            const { isAdmin, ...userDetails } = user._doc;
            
            return res.status(201).json({ user: userDetails, token: accessToken });
        } else {

            const accessToken = jwt.sign({email: user.email, id: user._id, isAdmin: user.isAdmin}, 'jwtkey', {expiresIn: '7d'});

            const { isAdmin, ...userDetails } = user._doc;

            return res.status(200).json({ user: userDetails, accessToken });
        }
        
    } catch (error: any) {
        handle500Errors(error, res);
        
    } finally {
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


import User from "../../model/user.model";
import { Response, Request } from "express"
import { requestOtp, deleteOtp } from "../../services/auth/requestOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";
import jwt from 'jsonwebtoken';




const sendSignupOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if(user) return res.status(422).send({ status: 409, msg: 'A user with this email already  exist, please login'});
        
        const otp = await requestOtp({ email });

        res.status(200).send({ status: 200, msg: 'OTP sent successfully!', code: otp});
    } catch (error) {
         handle500Errors(error, res)

    }
}


const sendLoginOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user) return res.status(404).send({ status: 404, msg: 'A user with this email does not exist'});
        
        const otp = await requestOtp({ email });

        res.status(200).send({ status: 200, msg: 'OTP sent successfully!', code: otp});
    } catch (error) {
         handle500Errors(error, res)

    }
}


const signUp = async (req: Request, res: Response) => {

    const { email, inputCode, referalCode } = req.body;
    try {

        let user;
        
        const isOtpValid = await verifyOtp(email, inputCode);

        if (!isOtpValid) return res.status(403).send({ status: 403, message: 'Otp not valid or has expired' })


        const generatedId = await generateAcctID();
        const generatedReferalId = await generateReferalId(email);

        let referringUser;
        if (referalCode) {
            referringUser = await User.findOne({ referalId: referalCode });

            if (!referringUser) {
                return res.status(400).send({ status: 400, msg: 'Invalid referral code' });
            }

        }

        user = new User({
            ...req.body,
            acctType: 'real',
            acctId: generatedId,
            referalId: generatedReferalId,
            referalCode: referringUser ? referringUser.referalId : null,
        })

        await Promise.all([user.save(), referringUser?.updateOne({ $push: { referals: user._id } })]);

        const token = jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, 'jwtkey', { expiresIn: '7d' });

        const { isAdmin, ...userDetails } = user._doc;

        res.status(201).json({ status: 200, msg: 'User created successfully', user: userDetails, token: token });
        
        
    } catch (error: any) {
        handle500Errors(error, res);
        
    } finally {
        await deleteOtp(email);
    }
    
}





const login = async (req: Request, res: Response) => {
    const { email, inputCode } = req.body;
    try {
        let user = await User.findOne({ email });

        if(!user) return res.status(404).send({ status: 404, message: 'User with this email does not exist' });

        const isVerified = await verifyOtp(email, inputCode);

        if(!isVerified) return res.send({ status: 403, message: 'Otp not valid or has expired' });


        const accessToken = jwt.sign({email: user.email, id: user._id, isAdmin: user.isAdmin}, 'jwtkey', {expiresIn: '7d'});

        const { isAdmin, ...userDetails } = user._doc;

        res.status(200).json({ status: 200, msg: 'Logged in successfully',  user: userDetails, token: accessToken });

    } catch (error) {
        handle500Errors(error, res);
        
    } finally {

        await deleteOtp(email);
    }
}


export { login, signUp, sendSignupOtp, sendLoginOtp }


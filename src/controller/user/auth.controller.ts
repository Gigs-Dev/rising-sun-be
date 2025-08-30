import User from "../../model/user.model";
import { Response, Request } from "express"
import { sendOtp, deleteOtp } from "../../services/auth/sendOtp";
import { handle500Errors } from "../../util/api-response";
import { verifyOtp } from "../../services/auth/verifyOtp";
import { generateAcctID, generateReferalId } from "../../services/auth/generateId";
import jwt from 'jsonwebtoken';
import { generateRandomOTP } from "../../util/util-gen";




const sendSignupOtp = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).send({
                status: 409,
                msg: 'A user with this email already exists, please login',
            });
        }

        // Generate OTP
        const otp = generateRandomOTP().toString();

        // Send OTP email
        await sendOtp({ email }, 'Rising Sun OTP Verification', otp);

        // Success response
        res.status(200).send({
            status: 200,
            msg: 'OTP sent successfully! Please check your email.',
        });
    } catch (error: any) {
        res.status(500).json({msg: error.message})
        // handle500Errors(error, res);
    }
};


const sendLoginOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if(!user) return res.status(409).send({ status: 404, msg: 'A user with this email does not exist'});

        const otp = generateRandomOTP().toString();
        
        await sendOtp({ email }, 'Rising Sun OTP Verification', otp);

        res.status(200).send({ status: 200, msg: 'OTP sent successfully!', code: otp});
    } catch (error) {
         handle500Errors(error, res)

    }
}


const signUp = async (req: Request, res: Response) => {

    const { email, code, referalCode } = req.body;
    try {

        let user;
        
        const isOtpValid = await verifyOtp(email, code);

        if (!isOtpValid) return res.status(403).send({ status: 403, message: 'Otp not valid or has expired' })


        const generatedId = await generateAcctID();
        const generatedReferalId = await generateReferalId(email);

        let referringUser;
        if (referalCode) {
            referringUser = await User.findOne({ referalId: referalCode });

            if (!referringUser) {
                return res.send({ status: 422, msg: 'Invalid referral code' });
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

        const token = jwt.sign({ email: user.email, id: user._id, isAdmin: user.isAdmin }, 'jwtkey', { expiresIn: '14d' });

        const { isAdmin, ...userDetails } = user._doc;

        res.status(201).json({ status: 200, msg: 'User created successfully', user: userDetails, token: token });
        
        
    } catch (error: any) {
        handle500Errors(error, res);
    
    } finally {
        await deleteOtp(email);
    }
    
}




const login = async (req: Request, res: Response) => {
    const { email, code } = req.body;
    try {
        let user = await User.findOne({ email });

        if(!user) return res.send({ status: 404, message: 'User with this email does not exist' });

        const isVerified = await verifyOtp(email, code);

        if(!isVerified) return res.send({ status: 403, message: 'Otp not valid or has expired' });


        const accessToken = jwt.sign({email: user.email, id: user._id, isAdmin: user.isAdmin}, 'jwtkey', {expiresIn: '14d'});

        const { isAdmin, ...userDetails } = user._doc;

        res.status(200).json({ status: 200, msg: 'Logged in successfully',  user: userDetails, token: accessToken });

    } catch (error) {
        handle500Errors(error, res);
        
    }
     finally {

        await deleteOtp(email);
    }
}


export { login, signUp, sendSignupOtp, sendLoginOtp }


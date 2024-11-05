import { Response, Request } from "express";
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";


export const getReferals = async (req: Request, res: Response) =>  {
    try {
        const { referalId } = req.params;

        const user = await User.findOne({ referalId }).populate('referals');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const referrals = await User.find({ _id: { $in: user.referals } });

        return res.status(200).json({ referrals });
    } catch (error) {
        handle500Errors(error, res)
    }

}

export const singleUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        return res.status(200).json(user)
    } catch (error) {
        res.status(200).json(error)
    }
}



export const creditReferer = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}

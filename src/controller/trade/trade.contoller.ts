import { Request, Response } from 'express';
import { handle500Errors } from '../../util/api-response';
import Trade from '../../model/trade.model';
import User from '../../model/user.model'


declare module 'express-serve-static-core' {
    interface Request {
        userId?: string; 
    }
}


export const createTrade = async (req: Request, res: Response) => {

    const { tradeType, amount, result } = req.body;
    try {
        const user = await User.findById(req.userId);
        if(!user) return res.json({msg: 'Invalid user or user not found'});

        const newTradw = await Trade.create({
            tradeType, result, amount
        });

        if(result === true){

            if(amount < user.acctBal) return res.json({msg: 'Insufficient balance'});

            user.acctBal += (amount * 1.8)

            await Promise.all([user.save(), newTradw.save()])
        } else {

            user.acctBal -= amount 

            await Promise.all([user.save(), newTradw.save()])
        }

        return res.status(200).json({trade: newTradw, user: user})
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const tradeHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        const trades = await Trade.find({ user: userId });
        if(trades.length === 0) {
            return res.json({ message: 'No trade found for this user' });
        }

        res.status(200).json(trades);
    } catch (error) {
        handle500Errors(error, res)
    }
}


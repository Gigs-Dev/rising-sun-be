import { Request, Response } from 'express';
import { handle500Errors } from '../../util/api-response';
import Trade from '../../model/trade.model';


export const createTrade = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const tradeHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const trades = await Trade.find({ user: userId });
        if(!trades || trades.length === 0) {
            res.status(404).json({ message: 'No trade found for this user' });
            return;
        }

        res.status(200).json(trades);
    } catch (error) {
        handle500Errors(error, res)
    }
}

import { Request, Response } from "express";
import Account from "../../model/account.model";
import User from "../../model/user.model";
import { handle500Errors } from "../../util/api-response";


export const creditAccount = async (req:Request, res: Response) => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const verifyCredit = async (req:Request, res: Response) => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const debitAccount = async (req:Request, res: Response) => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const verifyDebit = async (req:Request, res: Response) => {
    try {
        
    } catch (error) {
        handle500Errors(error, res)
    }
}


export const getAccountHistory = async (req:Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        const history = await Account.find({ user: userId }).sort({ createdAt: -1 });

        if(!history || history.length === 0){
            res.status(404).json({ message: 'No transaction found for user' });
            return;
        }

        res.status(200).json(history);
    } catch (error) {
        handle500Errors(error, res)
    }
}

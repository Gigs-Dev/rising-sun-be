import { Request, Response } from 'express'
import Games from '../models/game.model'
import { sendResponse } from '../utils/sendResponse'
import { HttpStatus } from '../constants/http-status'


export const gameWinners = async (req: Request, res: Response) => {
    const userId = req.user.id

    if(!userId) return sendResponse(res, HttpStatus.FORBIDDEN, false, 'Invalid or forbidden request!', null);

    const { amount, gameType } = req.body
    const game = new Games({
        userId,
        amount,
        gameType,
    })

    await game.save();

    return sendResponse(res, HttpStatus.OK, true, 'Game created successfully!', game)
}


export const getLatestWinners = async (req: Request, res: Response) => {

    const games = await Games.find().sort({ createdAt: -1 }).limit(10);

    if(!games || games.length === 0){
         return sendResponse(res, HttpStatus.OK, true, 'No winners available!', games)
    }

    return sendResponse(res, HttpStatus.OK, true, 'Winners fetched successfully!', games)
}


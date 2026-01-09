import { Router } from "express";
import { gameWinners, getLatestWinners } from "../controllers/games.controller";
import { verifyUserToken } from "../middleware/verifyToken";

const gameRouter = Router();

gameRouter.post('/', verifyUserToken, gameWinners);

gameRouter.get('/latest-winners', verifyUserToken, getLatestWinners)


export default gameRouter;

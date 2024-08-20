import { Response } from "express";
import logger from "./logger";

export interface ApiServiceResponse<T> {
    status: number;
    data?: T;
    msg?: string;
}

type ErrorHandler<T extends Error> = (err: T, res: Response) => void;

export function makeRes<T>(status: number, msg: string): ApiServiceResponse<T> {
    return { status, msg };
}


export function makeApiRes<T>(res: Response, data: ApiServiceResponse<T>) {
    res = res.status(data.status);
    if (data.status < 300) {
      res.status(data.status).json({ data: data.data });
    } else {
      res.status(data.status).json({ msg: data.msg });
    }
}

export const handle500Errors: ErrorHandler<any> = (err, res) => {
    logger.warn(err.message);
    res.status(500).json({
      status: 500,
      msg: "This is on us. Our team is working to resolve this issue, thanks for your understanding",
    });
};


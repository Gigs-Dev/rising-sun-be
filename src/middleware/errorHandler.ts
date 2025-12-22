import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../constants/http-status";
import { AppError } from "../utils/app-error";

interface MongoError extends Error {
  code?: number;
  errors?: Record<string, { message: string }>;
}

export const globalErrorHandler = (
  err: MongoError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";

  // Known operational error
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Mongoose errors
  switch (err.name) {
    case "CastError":
      statusCode = HttpStatus.NOT_FOUND;
      message = "Resource not found";
      break;

    case "ValidationError":
      statusCode = HttpStatus.BAD_REQUEST;
      message = err.errors
        ? Object.values(err.errors)
            .map((e) => e.message)
            .join(", ")
        : "Validation failed";
      break;

    default:
      if (err.code === 11000) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = "Duplicate field value";
      }
      break;
  }

  const isDev = process.env.NODE_ENV === "development";

  // DEV ERROR response
  if (isDev) {
    res.status(statusCode).json({
      success: false,
      message,
      stack: err.stack,
      error: err
    });
  } else {
    // Production: hide details
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

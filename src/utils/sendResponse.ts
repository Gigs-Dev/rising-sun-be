/**
 * A reusable response handler for API responses
 *
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Indicates if request succeeded
 * @param {string} message - Response message
 * @param {object} [data] - Optional data to send back
 */

import { Response } from "express";

interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
) => {
  const response: ApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data })
  };

  return res.status(statusCode).json(response);
};

import { Request, Response } from "express";

export const pathNotFound = (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Path not found'
  })
}
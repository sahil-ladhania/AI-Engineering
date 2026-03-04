import { Request, Response, NextFunction } from "express";
import { getAllPersonasService } from "./personas.service";

export const getPersonas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const personas = await getAllPersonasService();

    res.status(200).json({
      success: true,
      data: { personas },
    });
  } catch (err) {
    next(err);
  }
};

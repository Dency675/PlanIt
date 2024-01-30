
import { Request, Response } from "express";
import calculations from "../../models/calculations";

// Function for retrieving calculations
const getCalculations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.query;
    const found = await calculations.findOne({
      where: { id: id }, 
    });

    if (found) {
      res.status(200).json({
        message: "Data retrieved successfully",
        data: found,
      });
    } else {
      res.status(404).json({
        message: "Data not found",
      });
    }
  } catch (error) {
    console.error("Error in calculationsGet:", error);
    res.status(500).json({  
      message: "Internal Server Error",
    });
  }
};

export default getCalculations;

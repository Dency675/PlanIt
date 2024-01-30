
import { Request,Response } from "express";
import crypto from 'crypto'
import calculations from "../../models/calculations";


const addCalculations =async (req:Request,res:Response) : Promise<void> => {
try {
    const { calculation_name } = req.body;

    const calculationsAdd = await calculations.create({
     calculation_name
    });

    res.status(200).json({
      message: "Data inserted successfully",
      data: calculationsAdd.toJSON(),
    });

  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: "Server Error",
    });
  }
}

export default addCalculations;




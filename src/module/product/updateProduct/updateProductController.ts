const express = require("express");
const router = express.Router();
import {Request, Response} from "express";
import UpdateProductUseCase from "./updateProductUseCase";

router.put('/product/:id', async (request: Request, response: Response) => {

    const {id} = request.params;
    const {title, description, price} = request.body;

    const updateProductUseCase = new UpdateProductUseCase();

    try {
        await updateProductUseCase.execute({id: Number(id), title, description, price});
    } catch (error) {
        if (error instanceof Error) {
            return response.status(400).json({message: error.message});
        }
    }

    return response.status(201).json();
});




module.exports = router;
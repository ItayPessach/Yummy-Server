import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {

    model: Model<ModelType>
    constructor(model: Model<ModelType>) {
        this.model = model;
    }

    async get(req: Request, res: Response) {
        try {
            if (req.query.name) {
                const entities = await this.model.find({ name: req.query.name });
                res.send(entities);
            } else {
                const entities = await this.model.find();
                res.send(entities);
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const entity = await this.model.findById(req.params.id);
            res.send(entity);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async post(req: Request, res: Response) {
        try {
            const entity = await this.model.create(req.body);
            res.status(201).send(entity);
        } catch (err) {
            console.log(err);
            res.status(406).send("fail: " + err.message);
        }
    }

    putById(req: Request, res: Response) {
        res.send("put student by id: " + req.params.id);
    }

    deleteById(req: Request, res: Response) {
        res.send("delete student by id: " + req.params.id);
    }
}

const createController = <ModelType>(model: Model<ModelType>) => {
    return new BaseController<ModelType>(model);
}

export default createController;

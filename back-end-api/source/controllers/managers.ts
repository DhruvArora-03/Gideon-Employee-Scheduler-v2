import { Request, Response, NextFunction } from 'express';
import { model, Schema } from 'mongoose';
import { isValidMID } from '../id_manager';

// create schema and model
const managerSchema: Schema = new Schema({
    mid: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    permissions: {type: String, required: true, default: 'READ-ONLY'}
});
const Manager = model('Managers', managerSchema);

// getting all managers
const getManagers = async (req: Request, res: Response, next: NextFunction) => {
    // query mongodb
    const managers = await Manager.find({});

    // return response
    return res.status(200).json({
        message: managers
    });
}

// create a new manager
const addManager = async (req: Request, res: Response, next: NextFunction) => {
    let mid: string = req.body.mid;
    let name: string = req.body.name ?? null;
    let permissions: string = req.body.permissions ?? null;
    
    // check that mid is valid an that name and permissions are non-null
    if (isValidMID(mid) || name === null || permissions === null) {
        return res.status(400).json({
            message: 'Invalid request',
            mid: mid
        });
    }

    // create a new manager
    const manager = new Manager({
        mid: mid,
        name: name,
        permissions: permissions
    });

    // save manager to mongodb
    await manager.save();

    // return response
    return res.status(201).json({
        message: manager
    });
}

// get a specific manager
const getManager = async (req: Request, res: Response, next: NextFunction) => {
    // read manager id from request
    let mid: string = req.params.mid;

    // query mongodb
    const manager = await Manager.findOne(
        { mid: mid }
    );

    // return response
    return res.status(200).json({
        message: manager
    });

}

// update an existing manager
const updateManager = async (req: Request, res: Response, next: NextFunction) => {
    // read manager id from request
    let mid: string = req.params.mid;

    // read manager name from request if exists
    let name: string = req.body.name ?? null;
    // read manager permissions from request if exists
    let permissions: string = req.body.permissions ?? null;

    // query mongodb
    const manager = await Manager.findOneAndUpdate(
        { mid: mid },
        {
            ...(name && { name }),
            ...(permissions && { permissions })
        },
        { new: true }
    );

    // return response
    return res.status(200).json({
        message: manager
    });
}

// delete an existing manager
const deleteManager = async (req: Request, res: Response, next: NextFunction) => {
    // read manager id from request
    let mid: string = req.params.mid;

    // query mongodb
    const manager = await Manager.findOneAndDelete(
        { mid: mid }
    );

    // return response
    return res.status(200).json({
        message: manager
    });
}


export default {
    getManagers,
    addManager,
    getManager,
    updateManager,
    deleteManager
}
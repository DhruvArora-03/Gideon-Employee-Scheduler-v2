import { Request, Response, NextFunction } from 'express';
import { model, Schema } from 'mongoose';
import { isValidEID } from '../id_manager';

// create schema and model
const availabilitySchema: Schema = new Schema({
    eid: {type: String, required: true, unique: true},
    monday: {type: Object, required: true, default: {start: "", end: ""}},
    tuesday: {type: Object, required: true, default: {start: "", end: ""}},
    wednesday: {type: Object, required: true, default: {start: "", end: ""}},
    thursday: {type: Object, required: true, default: {start: "", end: ""}},
    friday: {type: Object, required: true, default: {start: "", end: ""}},
    saturday: {type: Object, required: true, default: {start: "", end: ""}},
    sunday: {type: Object, required: true, default: {start: "", end: ""}}
});
const Availability = model('Availabilities', availabilitySchema);

// get specifc availability
const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;

    // check that eid is valid
    if (isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invalid request',
            eid: eid
        });
    }

    // query mongodb
    const availability = await Availability.findOne(
        { eid: eid }
    );

    // return response
    return res.status(200).json({
        message: availability
    });
}

// update a specific availability
const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;

    // check that eid is valid
    if (isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invaleid request',
            eid: eid
        });
    }

    // query mongodb
    const availability = await Availability.findOneAndUpdate(
        { eid: eid },
        {
            ...(req.body.monday && { monday: req.body.monday }),
            ...(req.body.tuesday && { tuesday: req.body.tuesday }),
            ...(req.body.wednesday && { wednesday: req.body.wednesday }),
            ...(req.body.thursday && { thursday: req.body.thursday }),
            ...(req.body.friday && { friday: req.body.friday }),
            ...(req.body.saturday && { saturday: req.body.saturday }),
            ...(req.body.sunday && { sunday: req.body.sunday })
        },
        { new: true }
    );

    // return response
    return res.status(200).json({
        message: availability
    });
}

export default {
    Availability,
    getAvailability,
    updateAvailability
};

// FOLLOWING IS ONLY FOR CREATING AND DELETING EMPLOYEES

// create new availability
const addAvailability = async (eid: string) => {
    // create a new availability
    const availability = new Availability({
        eid: eid
    });

    // save availability to mongodb
    await availability.save();

    // return response
    return availability;
}

// delete a specific availability
const deleteAvailability = async (eid: string) => {
    // query mongodb
    const availability = await Availability.findOneAndDelete(
        { eid: eid }
    );

    // return response
    return availability;
}

export {
    addAvailability,
    deleteAvailability
}
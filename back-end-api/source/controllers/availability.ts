import { Request, Response, NextFunction } from 'express';
import { model, Schema } from 'mongoose';
import { isValidEID } from '../id_manager';

// create schema and model
const availabilitySchema: Schema = new Schema({
    eid: {type: String, required: true, unique: true},
    data: {type: Object, required: true, default: [
        {day: "Monday", available: false, earliest: "", latest: ""},
        {day: "Tuesday", available: false, earliest: "", latest: ""},
        {day: "Wednesday", available: false, earliest: "", latest: ""},
        {day: "Thursday", available: false, earliest: "", latest: ""},
        {day: "Friday", available: false, earliest: "", latest: ""},
        {day: "Saturday", available: false, earliest: "", latest: ""},
        {day: "Sunday", available: false, earliest: "", latest: ""}
    ]}
});
const Availability = model('Availabilities', availabilitySchema);

// get specifc availability
const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;

    // check that eid is valid
    if (!isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invalid request',
            eid: eid
        });
    }

    // query mongodb
    const availability = await Availability.findOne(
        { eid: eid }
    );

    // if availability is null, return 404
    if (availability === null) {
        return res.status(404).json({
            message: 'Availability not found',
            eid: eid
        });
    }

    // return response
    return res.status(200).json(availability.get('data'));
}

// update a specific availability
const updateAvailability = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;

    // check that eid is valid
    if (!isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invalid request',
            eid: eid
        });
    }

    // query mongodb and replace availability with eid of eid and in data, replace the day with the day in the request
    const availability = await Availability.findOneAndUpdate(
        { eid: eid },
        {
            ...(req.body.data && { data: req.body.data })
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
import { Request, Response, NextFunction } from 'express';
import { Model, model, Schema } from 'mongoose';
import { isValidEID, isValidSID } from '../id_manager';

// create schema and model
const shiftSchema: Schema = new Schema({
    sid: {type: String, required: true, unique: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true},
    employees: {type: Array, required: true, default: []},
    employeesNeeded: {type: Number, required: true, default: -1}
});
const Shift = model('Shifts', shiftSchema);

// get all shifts
const getAllShifts = async (req: Request, res: Response, next: NextFunction) => {
    // query mongodb
    const shifts = await Shift.find({});

    // return response
    return res.status(200).json({
        message: shifts
    });
}

// get shifts for a specific employee
const getShiftsForEmployee = async (req: Request, res: Response, next: NextFunction) => {
    // query mongodb for shifts that contain the employee id and are not in the past
    const shifts = await Shift.find({
        employees: req.params.eid,
        end: {$gte: new Date()}
    });

    // return response
    return res.status(200).json(shifts);
}

// create a new shift
const createShift = async (req: Request, res: Response, next: NextFunction) => {
    const sid: string = req.body.sid;
    const date: string = req.body.date;
    const startTime: string = req.body.startTime
    const endTime: string = req.body.endTime;
    
    const startDate: Date = new Date(date + ' ' + startTime);
    const endDate: Date = new Date(date + ' ' + endTime);

    // check for valid sid
    if (!isValidSID(sid)) {
        return res.status(400).json({
            message: 'Invalid shift ID',
            sid: sid
        });
    }

    // check for valid start
    if (isNaN(startDate.getTime())) {
        return res.status(400).json({
            message: 'Invalid start',
            startDate: startDate
        });
    }

    // check for valid end
    if (isNaN(endDate.getTime())) {
        return res.status(400).json({
            message: 'Invalid end',
            endDate: endDate
        });
    }

    // create a new shift
    const shift = new Shift({
        sid: sid,
        start: startDate,
        end: endDate,
        endTime: req.body.endTime,
        employeesNeeded: req.body.employeesNeeded
    });

    // save to mongodb
    const result = await shift.save();

    // return response
    return res.status(201).json({
        message: result
    });
}

// update a shift
const updateShift = async (req: Request, res: Response, next: NextFunction) => {
    // query mongodb
    const shift = await Shift.find({

    });

    // return response
    return res.status(200).json({
        message: shift
    });
}

// delete a shift
const deleteShiftsPriorTo = async (req: Request, res: Response, next: NextFunction) => {
    // delete all shifts that come before and including the date: req.body.date
    const shift = await Shift.deleteMany({date: {$lte: req.body.date}});

    // return response
    return res.status(200).json({
        message: shift
    });
}

// get employees for a shift
const getEmployeesForShift = async (req: Request, res: Response, next: NextFunction) => {
    // query mongodb
    const employees = await Shift.find({sid: req.params.sid}).select('employees');

    // return response
    return res.status(200).json({
        message: employees
    });
}

// add an employee to a shift
const addEmployeeToShift = async (req: Request, res: Response, next: NextFunction) => {
    let eid: string = req.body.eid;
    let sid: string = req.params.sid;

    if (!isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invalid employee ID',
            eid: eid
        });
    }

    if (!isValidSID(sid)) {
        return res.status(400).json({
            message: 'Invalid shift ID',
            sid: sid
        });
    }

    // query mongodb and push employee to shift only not already in shift
    const shift = await Shift.findOneAndUpdate(
        {sid: sid, employees: {$ne: eid}},
        {
            $push: {employees: eid}
        },
        {new: true}
    );
    

    // return response
    return res.status(200).json({
        message: shift
    });
}

// remove an employee from a shift
const removeEmployeeFromShift = async (req: Request, res: Response, next: NextFunction) => {
    let eid: string = req.params.eid;
    let sid: string = req.params.sid;

    if (!isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invalid employee ID',
            eid: eid
        });
    }

    if (!isValidSID(sid)) {
        return res.status(400).json({
            message: 'Invalid shift ID',
            sid: sid
        });
    }

    // query mongodb and remove employee from shift only if employees array contains employee
    const shift = await Shift.findOneAndUpdate(
        {sid: sid, employees: {$in: eid}},
        {
            $pull: {employees: eid}
        },
        {new: true}
    );

    // return response
    return res.status(200).json({
        message: shift
    });
}

export default {
    getAllShifts,
    getShiftsForEmployee,
    createShift,
    updateShift,
    deleteShiftsPriorTo,
    getEmployeesForShift,
    addEmployeeToShift,
    removeEmployeeFromShift
};
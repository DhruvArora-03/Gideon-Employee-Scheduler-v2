import e, { Request, Response, NextFunction } from 'express';
import { model, Schema } from 'mongoose';
import { addAvailability, deleteAvailability } from './availability';
import { isValidEID } from '../id_manager';

// create schema and model
const employeeSchema: Schema = new Schema({
    eid: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    exceptions: {type: Object, required: true, default: {}}
});
const Employee = model('Employees', employeeSchema);

// getting all employees
const getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    // query mongodb
    const employees = await Employee.find({});
    
    // return response
    return res.status(200).json({
        message: employees
    });
}

// create a new employee
const addEmployee = async (req: Request, res: Response, next: NextFunction) => {
    let eid: string = req.body.eid ?? null;
    let firstName: string = req.body.firstName ?? null;
    let lastName: string = req.body.lastName ?? null;

    // check that eid is valid an that name is non-null
    if (!isValidEID(eid) 
        || firstName === null || firstName.trim().length == 0 
        || lastName === null || lastName.trim().length == 0) {
        return res.status(400).json({
            message: 'Invalid request',
            eid: eid,
            firstName: firstName,
            lastName: lastName
        });
    }

    // create a new employee
    const employee = new Employee({
        eid: eid,
        firstName: firstName,
        lastName: lastName,
        ...(req.body.exceptions && { exceptions: req.body.exceptions })
    });

    // save employee to mongodb
    await employee.save();

    // request a new default_availability
    let default_availability = await addAvailability(eid);

    // return response
    return res.status(201).json({
        message: employee,
        default_availability: default_availability
    });
}

// get a specific employee
const getEmployee = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;
    
    // check if eid is valid
    if (!isValidEID(eid)) {
        return res.status(400).json({
            message: 'Invalid request',
            eid: eid
        });
    }

    // query mongodb
    let employee = await Employee.findOne(
        { eid: eid }
    );

    // check if employee exists
    if (employee === null) {
        return res.status(404).json({
            message: 'Employee not found',
            eid: eid
        });
    }

    // return response
    return res.status(200).json({
        message: "SUCCESS!",
        eid: employee.get('eid') ?? "",
        firstName: employee.get('firstName') ?? "",
        lastName: employee.get('lastName') ?? ""
    });
}

// update an existing employee
const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;
    
    // query mongodb
    const employee = await Employee.findOneAndUpdate(
        { eid: eid },
        {
            ...(req.body.firstName && { firstName: req.body.firstName }),
            ...(req.body.lastName && { lastName: req.body.lastName }),
            
        },
        { new: true }
    );

    // return response
    return res.status(200).json({
        message: employee
    });
}

// delete an existing employee
const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    // read employee id from request
    let eid: string = req.params.eid;
    
    // query mongodb
    const employee = await Employee.findOneAndDelete(
        { eid: eid }
    );

    // delete employee's availability
    let availability = await deleteAvailability(eid);

    // return response
    return res.status(200).json({
        message: employee,
        availability: availability
    });
}

export default {
    getEmployees,
    addEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee
}
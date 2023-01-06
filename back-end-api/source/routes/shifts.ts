import express from 'express';
import controller from '../controllers/shifts';

const router = express.Router();

router.get('/shifts', controller.getAllShifts);
router.get('/shifts/:eid', controller.getShiftsForEmployee);
router.post('/shifts', controller.createShift);
router.put('/shifts/:sid', controller.updateShift);
router.delete('/shifts/:date', controller.deleteShiftsPriorTo);

router.get('/shifts/:sid/employees', controller.getEmployeesForShift);
router.post('/shifts/:sid/employees', controller.addEmployeeToShift);
router.delete('/shifts/:sid/employees/:eid', controller.removeEmployeeFromShift);


export default router;
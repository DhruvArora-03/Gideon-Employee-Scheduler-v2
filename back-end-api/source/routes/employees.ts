import express from 'express';
import controller from '../controllers/employees';

const router = express.Router();

router.get('/employees', controller.getEmployees);
router.post('/employees', controller.addEmployee);

router.get('/employee/:eid', controller.getEmployee);
router.put('/employee/:eid', controller.updateEmployee);
router.delete('/employee/:eid', controller.deleteEmployee);

export default router;
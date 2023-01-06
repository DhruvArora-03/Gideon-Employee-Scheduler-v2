import express from 'express';
import controller from '../controllers/availability';

const router = express.Router();

router.get('/employee/:eid/availbility', controller.getAvailability);
router.put('/employee/:eid/availbility', controller.updateAvailability);

export default router;
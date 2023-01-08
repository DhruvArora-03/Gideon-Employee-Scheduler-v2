import express from 'express';
import controller from '../controllers/availability';

const router = express.Router();

router.get('/employee/:eid/availability', controller.getAvailability);
router.put('/employee/:eid/availability', controller.updateAvailability);

export default router;
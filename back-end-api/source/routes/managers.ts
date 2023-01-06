import express from 'express';
import controller from '../controllers/managers';

const router = express.Router();

router.get('/managers', controller.getManagers);
router.post('/managers', controller.addManager);

router.get('/manager/:mid', controller.getManager);
router.put('/manager/:mid', controller.updateManager);
router.delete('/manager/:mid', controller.deleteManager);

export default router;
import express from 'express';
import { eventController } from '../controllers/event.controller.js';
import { controllerWrapper } from '../middlewares/controller.wrapper.js';

export const apiRouter = express.Router();

apiRouter.get('/track', controllerWrapper(eventController.insert));
apiRouter.get('/events', controllerWrapper(eventController.list));

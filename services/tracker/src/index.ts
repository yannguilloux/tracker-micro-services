import 'dotenv/config';
import express from 'express';
import { apiRouter } from './routers/api.router.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }),
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);

app.use('/api', apiRouter);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const SERVICE_NAME = process.env.SERVICE_NAME || 'tracker';

app.listen(PORT, () => {
  console.log(
    `🚀  Server of service ${SERVICE_NAME} listening on http://localhost:${PORT}`,
  );
});

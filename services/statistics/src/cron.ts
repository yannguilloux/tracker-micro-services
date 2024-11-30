import 'dotenv/config';
import { CronJob } from 'cron';
import { mainController } from './controllers/main.controller.js';

const todayDate = new Date().toISOString().slice(0, 10);
const tomorrowDate = new Date(
  new Date().setDate(new Date().getDate() + 1),
).toISOString();

// const dailyJob = new CronJob(
//   "* */10 * * * *", // toutes les 10 minutes
//   () => {
//     mainController.stats({
//       ventilation: "daily",
//       from: todayDate,
//       to: tomorrowDate,
//       collection: `daily_${todayDate}`,
//     });
//   },
//   null, // onComplete
//   true, // start
//   Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Paris", // timeZone
// );

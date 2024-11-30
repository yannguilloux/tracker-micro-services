import 'dotenv/config';
import { Command } from 'commander';
import { mainController } from './controllers/main.controller.js';

const program = new Command();

program
  .command('stats')
  .description('Statistics')
  .option(
    '--ventilation <type>, -V <type>',
    'choose ventilation type (daily, monthly, yearly)',
  )
  .option('--from <date>', 'choose start date for statistics (optional)')
  .option('--to <date>', 'choose end date for statistics (optional)')
  .option('--file <path>', 'export statistics to file (optional)')
  .option('--collection <name>', 'export statistics to collection (optional)')
  .action(async (options) => {
    await mainController.stats(options);
    process.exit(0);
  });

program.parse();

import { eventDatamapper } from '../datasources/mongodb/event.datamapper.js';
import { writeFile } from 'fs/promises';

type StatsOptions = {
  ventilation: string;
  from: string;
  to: string;
  file?: string;
  collection?: string;
};

export const mainController = {
  async stats(options: StatsOptions) {
    if (options.to === '') {
      options.to = new Date(
        new Date().setDate(new Date().getDate() + 1),
      ).toISOString();
    }

    const stats = await eventDatamapper.getStats(
      options.ventilation,
      options.from,
      options.to,
      options.collection,
    );

    if (options.file) {
      await writeFile(options.file, JSON.stringify(stats));
      console.log(
        `[${new Date().toISOString()}] Exported to file: ${options.file}`,
      );
    } else if (options.collection) {
      console.log(
        `[${new Date().toISOString()}] Exported to collection: ${options.collection}`,
      );
    } else {
      console.log(stats);
    }
  },
};

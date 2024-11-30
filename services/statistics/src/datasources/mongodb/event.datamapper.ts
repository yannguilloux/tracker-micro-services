import { db } from './mongo.client.js';
import { AggregationBuilder } from '../../utils/aggregation-builder.js';

export const eventDatamapper = {
  getDateFormat(ventilation: string) {
    let dateFormat;

    switch (ventilation) {
      default:
      case 'daily':
        dateFormat = '%Y-%m-%d';
        break;
      case 'monthly':
        dateFormat = '%Y-%m';
        break;
      case 'yearly':
        dateFormat = '%Y';
        break;
    }
    return dateFormat;
  },

  getPeriodKey(ventilation: string) {
    let periodKey;

    switch (ventilation) {
      default:
      case 'daily':
        periodKey = 'day';
        break;
      case 'monthly':
        periodKey = 'month';
        break;
      case 'yearly':
        periodKey = 'year';
        break;
    }
    return periodKey;
  },

  getDateRange(ventilation: string, from: string, to: string) {
    switch (ventilation) {
      case 'monthly':
        // month start date
        if (from) {
          from = from.slice(0, 8) + '01';
        }
        // next month start date which be exclusive
        if (to) {
          const date = new Date(to);
          const nextMonthFirstDay = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
          );
          to = nextMonthFirstDay.toISOString().slice(0, 10);
        }
        break;
      case 'yearly':
        // year start date
        if (from) {
          from = from.slice(0, 5) + '01-01';
        }
        // next year start date which be exclusive
        if (to) {
          to = to.slice(0, 5);
        }
        break;
    }
    return { from, to };
  },

  async getStats(
    ventilation = 'daily',
    inputFrom: string,
    inputTo: string,
    collection?: string,
  ) {
    const aggregationBuilder = new AggregationBuilder();

    const dateFormat = this.getDateFormat(ventilation);
    const ventilationKey = this.getPeriodKey(ventilation);
    const { from, to } = this.getDateRange(ventilation, inputFrom, inputTo);

    // Filter by date using objectId
    aggregationBuilder.filterByObjectIdCreationDate(from, to);

    aggregationBuilder.group(
      { $dateToString: { format: dateFormat, date: '$_id' } },
      {
        total: { $sum: 1 },
        click: {
          $sum: { $cond: { if: { $eq: ['$t', 'c'] }, then: 1, else: 0 } },
        },
        view: {
          $sum: { $cond: { if: { $eq: ['$t', 'v'] }, then: 1, else: 0 } },
        },
        purchase: {
          $sum: { $cond: { if: { $eq: ['$t', 'p'] }, then: 1, else: 0 } },
        },
      },
    );

    aggregationBuilder.project({
      _id: false,
      [ventilationKey]: '$_id',
      total: true,
      click: true,
      view: true,
      purchase: true,
    });

    aggregationBuilder.sort({ [ventilationKey]: 1 });

    if (collection) {
      aggregationBuilder.out(collection);
    }
    //console.dir(aggregationBuilder.build(), {depth: 10});
    return await db
      .collection('events')
      .aggregate(aggregationBuilder.build())
      .toArray();
  },
};

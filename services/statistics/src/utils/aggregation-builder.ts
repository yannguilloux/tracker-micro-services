import { ObjectId } from 'mongodb';
import {
  AggregationStage,
  DynamicSpec,
  GeoNearSpec,
  GraphLookupSpec,
  MergeLookupSpec,
  UnwindSpec,
} from './aggregation-builder.d';

export function timeStampToObjectId(datetime: string): string {
  /* Convert string date to Date object (otherwise assume timestamp is a date) */
  const timestamp = new Date(datetime).getTime();

  /* Convert date object to hex seconds since Unix epoch */
  const hexSeconds = Math.floor(timestamp / 1000).toString(16);

  return `${hexSeconds}${'0'.repeat(16)}`;
}

export class AggregationBuilder {
  private pipeline: AggregationStage[] = [];

  match(query: object): AggregationBuilder {
    this.pipeline.push({ $match: query });
    return this;
  }

  project(fields: object): AggregationBuilder {
    this.pipeline.push({ $project: fields });
    return this;
  }

  group(groupBy: string | object, groupSpec: object): AggregationBuilder {
    this.pipeline.push({ $group: { _id: groupBy, ...groupSpec } });
    return this;
  }

  sort(sortFields: { [key: string]: 1 | -1 }): AggregationBuilder {
    this.pipeline.push({ $sort: sortFields });
    return this;
  }

  limit(limit: number): AggregationBuilder {
    this.pipeline.push({ $limit: limit });
    return this;
  }

  skip(skip: number): AggregationBuilder {
    this.pipeline.push({ $skip: skip });
    return this;
  }

  unwind(path: string | UnwindSpec): AggregationBuilder {
    this.pipeline.push({ $unwind: path });
    return this;
  }

  lookup(
    from: string,
    localField: string,
    foreignField: string,
    as: string,
  ): AggregationBuilder {
    this.pipeline.push({
      $lookup: {
        from,
        localField,
        foreignField,
        as,
      },
    });
    return this;
  }

  addFields(fields: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $addFields: fields });
    return this;
  }

  set(fields: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $set: fields });
    return this;
  }

  unset(fields: string | string[]): AggregationBuilder {
    this.pipeline.push({ $unset: fields });
    return this;
  }

  count(field: string): AggregationBuilder {
    this.pipeline.push({ $count: field });
    return this;
  }

  facet(facets: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $facet: facets });
    return this;
  }

  bucket(bucketSpec: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $bucket: bucketSpec });
    return this;
  }

  bucketAuto(bucketAutoSpec: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $bucketAuto: bucketAutoSpec });
    return this;
  }

  sample(size: number): AggregationBuilder {
    this.pipeline.push({ $sample: { size } });
    return this;
  }

  sortByCount(field: string): AggregationBuilder {
    this.pipeline.push({ $sortByCount: field });
    return this;
  }

  geoNear(geoNearSpec: GeoNearSpec): AggregationBuilder {
    this.pipeline.push({ $geoNear: geoNearSpec });
    return this;
  }

  graphLookup(graphLookupSpec: GraphLookupSpec): AggregationBuilder {
    this.pipeline.push({ $graphLookup: graphLookupSpec });
    return this;
  }

  merge(mergeSpec: MergeLookupSpec): AggregationBuilder {
    this.pipeline.push({ $merge: mergeSpec });
    return this;
  }

  out(collection: string): AggregationBuilder {
    this.pipeline.push({ $out: collection });
    return this;
  }

  redact(redactSpec: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $redact: redactSpec });
    return this;
  }

  replaceRoot(newRoot: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $replaceRoot: newRoot });
    return this;
  }

  rename(renameSpec: { [key: string]: string }): AggregationBuilder {
    this.pipeline.push({ $rename: renameSpec });
    return this;
  }

  setWindowFields(windowFieldsSpec: DynamicSpec): AggregationBuilder {
    this.pipeline.push({ $setWindowFields: windowFieldsSpec });
    return this;
  }

  build(): AggregationStage[] {
    return this.pipeline;
  }

  reset(): void {
    this.pipeline = [];
  }

  filterByObjectIdCreationDate(from: string, to?: string): AggregationBuilder {
    const filter: { [key: string]: object } = {};

    if (from) {
      const fromOid = timeStampToObjectId(from);
      filter['$gte'] = new ObjectId(fromOid);
    }

    if (to) {
      const toOid = timeStampToObjectId(to);
      filter['$lt'] = new ObjectId(toOid);
    }

    this.match({ _id: filter });

    return this;
  }
}

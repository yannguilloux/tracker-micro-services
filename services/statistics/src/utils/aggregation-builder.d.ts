export type DynamicSpec<T = object> = { [key: string]: T };

export interface GeoNearSpec {
  near: object;
  distanceField: string;
  spherical: boolean;
  maxDistance?: number;
  minDistance?: number;
  query?: object;
}

export interface GraphLookupSpec {
  from: string;
  startWith: string;
  connectFromField: string;
  connectToField: string;
  as: string;
  maxDepth?: number;
  depthField?: string;
  restrictSearchWithMatch?: object;
}

export interface MergeLookupSpec {
  into: string | { db: string; coll: string };
  on: string | string[];
  let?: object;
  whenMatched?: string | object[];
  whenNotMatched?: string;
}

export interface LookupSpec {
  from: string;
  localField: string;
  foreignField: string;
  as: string;
}

export interface UnwindSpec {
  path: string;
  preserveNullAndEmptyArrays?: boolean;
}

export interface AggregationStage {
  $match?: object;
  $project?: object;
  $group?: object;
  $sort?: { [key: string]: 1 | -1 };
  $limit?: number;
  $skip?: number;
  $unwind?: string | UnwindSpec;
  $lookup?: LookupSpec;
  $addFields?: DynamicSpec;
  $set?: DynamicSpec;
  $unset?: string | string[];
  $count?: string;
  $facet?: DynamicSpec;
  $bucket?: DynamicSpec;
  $bucketAuto?: DynamicSpec;
  $sample?: { size: number };
  $sortByCount?: string;
  $indexStats?: object;
  $merge?: MergeLookupSpec;
  $out?: string;
  $redact?: DynamicSpec;
  $replaceRoot?: DynamicSpec;
  $rename?: { [key: string]: string };
  $setWindowFields?: DynamicSpec;
  $geoNear?: GeoNearSpec;
  $graphLookup?: GraphLookupSpec;
}

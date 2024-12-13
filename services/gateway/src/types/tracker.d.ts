export interface PaginationFilterOptionsSpec {
  offset?: number;
  limit?: number;
}

export interface EventSpec {
  t: string;
  sid: number;
  surl: string;
  ua: string;
  ip: string;
  link?: number;
}

export type ContextValueSpec = {
  dataSources: {
    db?: DbDatasource;
    event?: EventDatasource;
  };
};

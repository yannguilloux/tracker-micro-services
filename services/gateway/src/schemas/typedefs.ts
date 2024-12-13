import { readFileSync } from 'fs';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';

const schemas = [
  'query',
  'mutation',
  'link',
  'website',
  'visitor',
  'event',
].map((schemaName) => {
  return readFileSync(`./src/schemas/${schemaName}.gql`, 'utf8');
});
export const typeDefs = [schemas, ...scalarTypeDefs].join('\n');

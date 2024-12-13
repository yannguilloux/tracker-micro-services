import axios from 'axios';

type VisitorInputData = {
  uuid: string;
};

export const visitorDatamapper = {
  async insert(inputData: VisitorInputData) {
    const { uuid } = inputData;

    const { data } = await axios.post('http://localhost:3000/graphql', {
      query: `mutation addVisitor($input: VisitorInput!) {
        createVisitor(input: $input) {
          uuid
        }
      }`,
      variables: {
        input: {
          uuid,
        },
      },
    });
    return data;
  },
};

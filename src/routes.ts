import * as Hapi from "hapi";
import { sample_user, callAuthoriseApi, callback, createTokenRequest } from "./queries";

const sampleHandler = async(request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  return { hello: 'world'};
}

export const routes = [{
    method: 'GET',
    path: '/hello-world',
    handler: sampleHandler
  },
  {
    method: "GET",
    path: "/sample-user",
    handler: sample_user
  },
  {
    method: "GET",
    path: "/authorize",
    handler: callAuthoriseApi
  },
  {
    method: "GET",
    path: "/callback",
    handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      return callback(request.query.code, request.query.state);
      // return createTokenRequest(request.query.code)
    }
  }
  // add more routes here
];

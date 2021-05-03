import axios from 'axios';
import querystring from "querystring";
import _ from "lodash";
import restClient from "superagent-bluebird-promise";

const base_URL = process.env.MYINFO_BASE_URL;
const client_id = process.env.MYINFO_APP_CLIENT_ID;
const client_secret = process.env.MYINFO_APP_CLIENT_SECRET;
const redirect_uri = process.env.MYINFO_APP_REDIRECT_URL;

const instance = axios.create({
    baseURL: base_URL,
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});


export async function sample_user (uinfin) {
    const response = await instance.get(`/com/v3/person-sample/S9812381D`);
    return response.data;
}

// export async function authorize () {
//     const response = await instance.get("/com/v3/authorise", {
//         params: {
//             purpose: "For LHUB testing",
//             attributes: ["uinfin", "name", "sex", "race", "nationality"],
//             state: Math.round(Math.random() * 1000),
//             redirect_url: "http:/localhost:9000/",
//             client_id: "LHUB-1234567-ABCD"
//         },
//     });

//     console.log(response)
    
//     return response.data;
// }

export function callAuthoriseApi () {
    const params = {
        purpose: "For LHUB testing",
        attributes: "uinfin,name,sex,race,nationality",
        state: Math.round(Math.random() * 1000),
        redirect_url: "http://localhost:3001/callback",
        client_id
    };

    const authoriseUrl = "https://sandbox.api.myinfo.gov.sg/com/v3/authorise?client_id=" + params.client_id +
      "&attributes=" + params.attributes +
      "&purpose=" + params.purpose +
      "&state=" + params.state +
      "&redirect_uri=" + params.redirect_url;

    return authoriseUrl;
}


export async function callback (code, state) {
    const params = querystring.stringify({
        code,
        client_secret,
        client_id,
        redirect_uri,
        // state,
        grant_type: 'authorization_code',
    });

    try {
        const result = await instance.post("/com/v3/token", params, {
            headers: {
                'Content-Type': "application/x-www-form-urlencoded", // Important
                "Cache-Control": "no-cache",
                "Authorization": null
            }
        })

        console.log(result.data);
        return result.data;
    } catch (error) {
        console.error(error.response);
        return error.response;
    }
}

export async function createTokenRequest (code) {
  var cacheCtl = "no-cache";
  var contentType = "application/x-www-form-urlencoded";
  var method = "POST";
  var request = null;
   
  // preparing the request with header and parameters
  // assemble params for Token API
  var strParams = "grant_type=authorization_code" +
    "&code=" + code +
    "&redirect_uri=" + redirect_uri +
    "&client_id=" + client_id +
    "&client_secret=" + client_secret;
  var params = querystring.parse(strParams);
  console.log(params);
   
   
  // assemble headers for Token API
  var strHeaders = "Content-Type=" + contentType + "&Cache-Control=" + cacheCtl;
  var headers = querystring.parse(strHeaders);
   
  // Sign request and add Authorization Headers
  var authHeaders = null;
   
  if (!_.isEmpty(authHeaders)) {
    _.set(headers, "Authorization", authHeaders);
  }

  var request = restClient.post(base_URL + "/com/v3/token");
   
  // Set headers
  if (!_.isUndefined(headers) && !_.isEmpty(headers))
    request.set(headers);
   
  // Set Params
  if (!_.isUndefined(params) && !_.isEmpty(params))
    request.send(params);

//   console.log(request)

    request
    .buffer(true)
    .end(function(callErr, callRes) {
      if (callErr) {
        // ERROR
        console.error("Token Call Error: ",callErr.status);
        console.error(callErr.response.req.res.text);

        return "Error"
        // res.jsonp({
        //   status: "ERROR",
        //   msg: callErr
        // });
      } else {
        // SUCCESSFUL
        var data = {
          body: callRes.body,
          text: callRes.text
        };
        console.log("Response from Token API:".green);
        console.log(JSON.stringify(data.body));

        var accessToken = data.body.access_token;

        return accessToken
        // if (accessToken == undefined || accessToken == null) {
        //   res.jsonp({
        //     status: "ERROR",
        //     msg: "ACCESS TOKEN NOT FOUND"
        //   });
        // }

        // everything ok, call person API
        // callPersonAPI(accessToken, res);
      }
    });
}

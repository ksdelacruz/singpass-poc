# SingPass API POC

## Running the server
1. Copy ```.env``` to ```.env-dev``` and supply client ID and secret.
2. Run ```docker-compose up```.
3. Go to ```localhost:3001/hello-world``` to confirm the server is running.

## API Step-by-step 

Go to browser and do the following.

### 1. ```localhost:3001/authorize```
This API creates a link that will ask for authorization to SingPass client. Ideally, this API will automatically redirect to SingPass. For now, copy the link returned and go to the link.

### 2. ```localhost:3001/callback```
SingPass will automatically go to this callback URL. This is not changeable unless we are already an "on-boarded" app with SingPass (by then, we will use https://test.api.myinfo.gov.sg). This function returns access tokens to be used for accessing information of SingPass clients.

## Comments
The POC does not test accessing person info yet with access token.
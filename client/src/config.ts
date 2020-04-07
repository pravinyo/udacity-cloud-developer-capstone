// Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = ''
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'pravin-dev.auth0.com',
  clientId: '8kds2bqG66dmh4GEOdkXsF8T53qQRq7r',
  callbackUrl: 'http://localhost:3000/callback'
}

const sanityClient = require("@sanity/client");
const client = sanityClient({
  projectId: "3xrxtgic",
  dataset: "production",
  apiVersion: "2022-01-27", // use current UTC date - see "specifying API version"!
  token: "sanity-auth-token", // or leave blank for unauthenticated usage
  useCdn: false, // `false` if you want to ensure fresh data
});

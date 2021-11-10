const port = process.env.PORT || 8082;

const cityCosts = process.env.CITY_COSTS || {
  paris: 500,
  london: 450,
  barselona: 400,
  madrid: 350,
  rome: 300,
  amsterdam: 250,
  plague: 200,
  brussels: 150,
  budapest: 100,
  istanbul: 50,
};

const jwtTokenExpiration = process.env.JWT_TOKEN_EXPIRATION || 86400; // 24 hours.

const jwtSecret = process.env.JWT_SECRET || "token-secret-key";

const mongoConnectionUrl =
  process.env.MONGO_CONNECTION_URL ||
  "mongodb://localhost:27017/travel_plan_service";

const pexelsApiKey =
  process.env.PEXELS_API_KEY ||
  "563492ad6f91700001000001201e8fb3733448399f53cf13506aaa8f";

module.exports = {
  port,
  cityCosts,
  jwtTokenExpiration,
  jwtSecret,
  mongoConnectionUrl,
  pexelsApiKey,
};

## Travel Plan Service

A nodejs service that offers user 3 different travel plans. With the following steps:

- Create a user account to pass authentication 
- Login with new user and get the access-token
- Access rest endpoints with token, call /set-budget method for set user travel budget
- After call /generate-plan endpoint for travel plan suggestions

-----

- [How to run](#how-to-run)
    - [Running node server](#running-node-server)
    - [Running the service with compose](#running-the-service-with-compose)
    - [Running the Docker image with mongo connection](#running-the-docker-image-with-mongo-connection)
    - [Configuration](#configuration)
- [Api usage](#api-usage)
    - [Signup: Use for creating a new user](#signup-use-for-creating-a-new-user)
    - [Sign in](#sign-in)
    - [Set budget](#set-budget)
    - [Generate plan:](#generate-plan)
    - [Errors](#errors)
- [Contribution](#contribution)
    - [Prerequisites](#prerequisites)
    - [Development](#development)
- [Decision Record (comments)](#decision-record-comments)

## How to run

#### Running node server

```bash
node src/server.js
```

#### Running the service with compose

```bash
docker-compose up
# stop servers.
docker-compose down
```

#### Running the Docker image with mongo connection

```bash
docker build -t travel_plan_service .
docker run -e MONGO_CONNECTION_URL=mongodb://... travel_plan_service
```

#### Configuration

You might change the defaults with using following environment variables, for details please check `config.js`.
- CITY_COSTS, JWT_TOKEN_EXPIRATION, WT_SECRET, MONGO_CONNECTION_URL, PEXELS_API_KEY

## Api usage

### Signup: Use for creating a new user

Example Request:

```bash
curl --location --request POST 'http://localhost:8082/sign-up' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "test",
    "password": "123456",
    "email": "test@example.com"
}'
```

Example Response:

```
{
    "message": "User was registered successfully!"
}
```

### Sign in

Example Request:

```bash
curl --location --request POST 'http://localhost:8082/sign-in' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "test",
    "password": "123456"
}'
```

Example Response (In app auth service returns a JWT token):

```json
{
  "roles": ["ROLE_USER"],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOGIxZmY1ZDVjNTQwN2EzNWZlODkzNyIsImlhdCI6MTYzNjUwODIwMSwiZXhwIjoxNjM2NTk0NjAxfQ.X27bGeTIRgo9m-xh3QDl_FlcxGaUEMGWVFU3wJ2WZC0"
}
```

### Set budget

Example request:

```bash
curl --location --request POST 'http://localhost:8082/set-budget' \
--header 'Content-Type: application/json' \
--header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOGIxZmY1ZDVjNTQwN2EzNWZlODkzNyIsImlhdCI6MTYzNjUwODIwMSwiZXhwIjoxNjM2NTk0NjAxfQ.X27bGeTIRgo9m-xh3QDl_FlcxGaUEMGWVFU3wJ2WZC0' \
--data-raw '{
"budget": 3000
}'
```

Example response:

```json
{
  "message": "Budget entry successfully!"
}
```

### Generate plan:

Example request:

```bash
curl --location --request POST 'http://localhost:8082/generate-plan' \
--header 'Content-Type: application/json' \
--header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxOGIxZmY1ZDVjNTQwN2EzNWZlODkzNyIsImlhdCI6MTYzNjUwODIwMSwiZXhwIjoxNjM2NTk0NjAxfQ.X27bGeTIRgo9m-xh3QDl_FlcxGaUEMGWVFU3wJ2WZC0' \
--data-raw '{
    "cityinput": ["istanbul","paris","rome","barselona"]
}'
```

Example response:

```json
{
  "budget": "3000",
  "plans": [
    {
      "totalCost": 3000,
      "routes": [
        {
          "city": "istanbul",
          "dayCount": 4,
          "cost": 200,
          "images": [
            "https://images.pexels.com/photos/3684396/pexels-photo-3684396.jpeg",
            "https://images.pexels.com/photos/2042108/pexels-photo-2042108.jpeg",
            "https://images.pexels.com/photos/45189/pexels-photo-45189.jpeg"
          ]
        },
        {
          "city": "paris",
          "dayCount": 2,
          "cost": 1000,
          "images": [
            "https://images.pexels.com/photos/2825951/pexels-photo-2825951.jpeg",
            "https://images.pexels.com/photos/3214982/pexels-photo-3214982.jpeg",
            "https://images.pexels.com/photos/3596708/pexels-photo-3596708.jpeg"
          ]
        },
        {
          "city": "rome",
          "dayCount": 2,
          "cost": 600,
          "images": [
            "https://images.pexels.com/photos/227517/pexels-photo-227517.jpeg",
            "https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg",
            "https://images.pexels.com/photos/2676642/pexels-photo-2676642.jpeg"
          ]
        },
        {
          "city": "barselona",
          "dayCount": 3,
          "cost": 1200,
          "images": [
            "https://images.pexels.com/photos/1874675/pexels-photo-1874675.jpeg",
            "https://images.pexels.com/photos/705423/pexels-photo-705423.jpeg",
            "https://images.pexels.com/photos/3757136/pexels-photo-3757136.jpeg"
          ]
        }
      ]
    },
    {
      "totalCost": 3000,
      "routes": [
        {
          "city": "istanbul",
          "dayCount": 2,
          "cost": 100,
          "images": [
            "https://images.pexels.com/photos/2159549/pexels-photo-2159549.jpeg",
            "https://images.pexels.com/photos/1549326/pexels-photo-1549326.jpeg",
            "https://images.pexels.com/photos/45189/pexels-photo-45189.jpeg"
          ]
        },
        {
          "city": "paris",
          "dayCount": 3,
          "cost": 1500,
          "images": [
            "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg",
            "https://images.pexels.com/photos/1796722/pexels-photo-1796722.jpeg",
            "https://images.pexels.com/photos/4577368/pexels-photo-4577368.png"
          ]
        },
        {
          "city": "rome",
          "dayCount": 2,
          "cost": 600,
          "images": [
            "https://images.pexels.com/photos/1797161/pexels-photo-1797161.jpeg",
            "https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg",
            "https://images.pexels.com/photos/10922/pexels-photo-10922.jpeg"
          ]
        },
        {
          "city": "barselona",
          "dayCount": 2,
          "cost": 800,
          "images": [
            "https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg",
            "https://images.pexels.com/photos/3722818/pexels-photo-3722818.jpeg",
            "https://images.pexels.com/photos/51358/pexels-photo-51358.jpeg"
          ]
        }
      ]
    },
    {
      "totalCost": 3000,
      "routes": [
        {
          "city": "istanbul",
          "dayCount": 6,
          "cost": 300,
          "images": [
            "https://images.pexels.com/photos/2042109/pexels-photo-2042109.jpeg",
            "https://images.pexels.com/photos/987984/pexels-photo-987984.jpeg",
            "https://images.pexels.com/photos/2216275/pexels-photo-2216275.jpeg"
          ]
        },
        {
          "city": "paris",
          "dayCount": 2,
          "cost": 1000,
          "images": [
            "https://images.pexels.com/photos/5019013/pexels-photo-5019013.jpeg",
            "https://images.pexels.com/photos/3214982/pexels-photo-3214982.jpeg",
            "https://images.pexels.com/photos/1125212/pexels-photo-1125212.jpeg"
          ]
        },
        {
          "city": "rome",
          "dayCount": 3,
          "cost": 900,
          "images": [
            "https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg",
            "https://images.pexels.com/photos/615344/julius-caesar-rome-roman-empire-615344.jpeg",
            "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg"
          ]
        },
        {
          "city": "barselona",
          "dayCount": 2,
          "cost": 800,
          "images": [
            "https://images.pexels.com/photos/1386444/pexels-photo-1386444.jpeg",
            "https://images.pexels.com/photos/1874675/pexels-photo-1874675.jpeg",
            "https://images.pexels.com/photos/3757136/pexels-photo-3757136.jpeg"
          ]
        }
      ]
    }
  ]
}
```

### Errors

**Some of errors**:
- message: "User Not found."
- message: "Invalid Password!"
- message: "No token provided!"
- message: "Unauthorized Token!"
- message: "Failed! Username is already taken!"
- message: "Failed! Email is already taken!"
- message: "Budget is not set."
- message: "You have to choose 3-10 cities!"
- message: "Wrong city name input:"
- message: "Budget is not enough for travel."

> Note: I have used message pattern on the responses, for a better API design it might be better to return data. 

## Contribution

### Prerequisites

Minimum requirements are:

- **Node.js** version 14.
- **Npm** version 6.
- **Docker engine**

You can install all dependencies using `npm` with following command:

```
npm install
```

### Development

- Execute `npm run format` to auto-format files with prettier.
- Execute `npm run test` to run all tests and print the code coverage report.

## Decision Record (comments)

**Algorithm:**
The algorithm based on the different permutations of the travel routes.
Current algorithm is brute force approach and the complexity is high, so it might be slow when the city input size is big.
I focused to improve the timing on pexels core with using Promise.all concurrent calls.
The code quality is not good, as there were no time to refactor it. The next thing would be refactoring the implementation to improve performance, handling edge cases and making it more clean.

**DB usage:**
I'm using only 1 collection on mongodb to store user information, and using JWT token for auth. Here the db collections can be refactored also the results from the planner could be stored in DB to show past suggestions, but those scenarios not handled in the task due to time limitations.

**Tests:**
I tried to cover functionality with integration tests. But not all parts of the code  covered with tests. You might check the coverage report after executing the tests.

**Automation and deployment:**
The service is dockerized and for development purposes a docker-compose configuration added.
For the hosting, I am using google cloud run, the advantage of it easy of usage and auto scalability.



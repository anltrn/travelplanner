require("lodash.permutations");
const _ = require("lodash");
const { fetchCityImages } = require("./pexels-service");
const { db } = require("./mongodb");
const { cityCosts } = require("./config");

const setBudget = (req, res) => {
  // todo: Ensure budget is validated against if empty, invalid, Not a number etc.
  const budget = req.body.budget;
  if (!budget) {
    res.status(400).send({ message: "Budget is not set." });
    return;
  }

  // todo: return user object from post request as response
  db.user.findOneAndUpdate(
    { _id: req.userId },
    { $set: { budget } },
    { new: false },
    (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: "Budget entry complete!" });
    }
  );
};

const generatePlan = async (req, res) => {
  if (req.body.cityinput.length < 3 || req.body.cityinput.length > 10) {
    res.status(400);
    res.send({ message: "You have to choose 3-10 cities!" });
    return;
  }
  const citiesToVisit = req.body.cityinput;

  const wrongCities = _.find(citiesToVisit, (city) => !cityCosts[city]);

  if (wrongCities) {
    res.status(400);
    res.send({ message: "Wrong city name input:" + wrongCities });
    return;
  }

  const maxCityCount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const currentCityCount = maxCityCount.slice(0, citiesToVisit.length);

  let permutations = _.flatMap(currentCityCount, (v, i, a) =>
    _.permutations(a, i + 1)
  );
  let userBudget = "0";
  try {
    const user = await db.user
      .findOne({
        _id: req.userId,
      })
      .exec();

    userBudget = user.budget;

    let travelPlan = [];
    let minCost = userBudget + 1;
    _.each(citiesToVisit, (city) => {
      travelPlan.push({
        city,
        dayCount: 0,
        cost: 0,
        images: [],
      });
      if (minCost > cityCosts[city]) minCost = cityCosts[city];
    });
    let tempCityList = _.cloneDeep(citiesToVisit);
    const travelPlanArray = [];
    const travelPlanCostArray = [];
    let index = 0;
    let notFound = true;
    let searchComplete = false;
    const userBudgetFirstValue = userBudget;
    const removeIndexArr = [];
    while (true) {
      if (userBudget >= minCost) {
        _.each(tempCityList, (city, cityIndex) => {
          if (
            userBudget >= cityCosts[city] &&
            (_.isEmpty(removeIndexArr) || removeIndexArr[0].includes(cityIndex))
          ) {
            userBudget -= cityCosts[city];
            let planIndex = _.findIndex(
              travelPlan,
              (plan) => plan.city === city
            );
            travelPlan[planIndex].dayCount = travelPlan[planIndex].dayCount + 1;
            travelPlan[planIndex].cost =
              travelPlan[planIndex].cost + cityCosts[city];
            notFound = false;
          }
        });
      } else {
        let sameTravelPlan = false;

        _.each(travelPlanArray, (plan) => {
          let difference = _.differenceWith(plan, travelPlan, _.isEqual);
          if (_.isEmpty(difference)) {
            sameTravelPlan = true;

            return false;
          }
        });
        if (sameTravelPlan) {
        } else {
          travelPlanCostArray.push(userBudgetFirstValue - userBudget);
          const filteredTravelPlan = [];
          for (let y = 0; y < travelPlan.length; y++) {
            if (travelPlan[y].dayCount > 0) {
              filteredTravelPlan.push(travelPlan[y]);
            }
          }
          travelPlanArray.push(filteredTravelPlan);
        }
        travelPlan = [];
        _.each(citiesToVisit, (city) => {
          travelPlan.push({
            city,
            dayCount: 0,
            cost: 0,
            images: [],
          });
        });
        index = index + 1;
        if (index > 0) {
          if (permutations.length === 0) {
            searchComplete = true;
          } else if (_.isEmpty(removeIndexArr)) {
            removeIndexArr.push(permutations[permutations.length - 1]);
          } else {
            removeIndexArr.splice(0, 1, permutations[permutations.length - 1]);
          }
          permutations.pop();
        }
        userBudget = userBudgetFirstValue;
      }

      tempCityList = _.shuffle(tempCityList);
      if (notFound) {
        res.status(400);
        res.send({ message: "Budget is not enough for travel." });
        break;
      }
      if (travelPlanArray.length === 3 || searchComplete) {
        break;
      }
    }

    const plans = [];
    await Promise.all(
      travelPlanArray.map(async (routes, index) => {
        for (const route of routes) {
          route.images = await fetchCityImages(route.city, 3);
        }
        plans.push({ totalCost: travelPlanCostArray[index], routes });
      })
    );

    res.json({ message: 'Travelplan generated!',budget: userBudgetFirstValue, plans });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  setBudget,
  generatePlan,
};

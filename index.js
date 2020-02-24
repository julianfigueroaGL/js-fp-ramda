const R = require('ramda');
const cities = require('./cities.json');
const percentile = require('./percentile');

/* // Function Purity, Immutability, Currying, Composition

// Sophisticated with simple code

// Change temperture from Kelvin to Celsius for cities data
// First using JS map then using Ramda map
 */
// /* JS Map */
// const numbers = [1, 2, 3];

// function double(number) {
// 	return number * 2;
// }

// const doubledNumbers = numbers.map(double);

// console.log(doubledNumbers);
// /* JS Map Function */
// const toCelsius = 273.15;
const toFahrenheit = 459.67;

// const KtoC = k => k - toCelsius;
const KtoF = k => k * (9 / 5) - toFahrenheit;

// const updateTemperature = city => {
// 	const temp = Math.round(KtoC(city.temp));
// 	return R.merge(city, { temp });
// };

// const updatedCities = cities.map(updateTemperature);
// console.log(updatedCities);

// /* Flexible Transformations */
// /* JS only */
// const updateTemperature = covertFn => {
// 	return city => {
// 		const temp = Math.round(covertFn(city.temp));
// 		return R.merge(city, { temp });
// 	};
// };
// const updatedCities = cities.map(updateTemperature(KtoF));
// console.log(updatedCities);

///* Ramda */
const updateTemperature = R.curry((covertFn, city) => {
	const temp = Math.round(covertFn(city.temp));
	return R.merge(city, { temp });
});
const updatedCities = R.map(updateTemperature(KtoF), cities);
// console.log(updatedCities);

// /* Single city */
// const city = cities[0];
// const updatedCity = updateTemperature(KtoC, city);
// console.log(updatedCity);

// /* Reduce JS */
// const totalCostReducer = (acc, city) => {
// 	const { cost = 0 } = city;
// 	return acc + cost;
// };
// const totalCost = updatedCities.reduce(totalCostReducer, 0);
// const cityCount = updatedCities.length;
// console.log(totalCost / cityCount);

// /* Ramda Reduce */
// const totalCostReducer = (acc, city) => {
// 	const { cost = 0 } = city;
// 	return acc + cost;
// };
// const totalCost = R.reduce(totalCostReducer, 0, updatedCities);
// const cityCount = R.length(updatedCities);
// console.log(totalCost / cityCount);

const groupByReducer = (acc, city) => {
	const { cost = 0, internetSpeed = [] } = acc;
	return R.mergeRight(acc, {
		cost: R.append(city.cost, cost),
		internetSpeed: R.append(city.internetSpeed, internetSpeed)
	});
};

const groupedByProp = R.reduce(groupByReducer, {}, updatedCities);
// console.log(groupedByProp);

/* Calculate Score */
const calcScore = city => {
	const { cost = 0, internetSpeed = 0 } = city;
	const costPercentile = percentile(groupedByProp.cost, cost);
	const internetPercentile = percentile(groupedByProp.internetSpeed, internetSpeed);
	const score = 100 * (1.0 - costPercentile) + 20 * internetPercentile;
	return R.mergeRight(city, { score });
};
const scoredCities = R.map(calcScore, updatedCities);
// console.log(scoredCities);

/* Filter Cities by weather */
const filterByWeather = city => {
	const { temp = 0, humidity = 0 } = city;
	return temp > 68 && temp < 85 && humidity > 30 && humidity < 70;
};

const filteredCities = R.filter(filterByWeather, scoredCities);
// console.log(filteredCities);

/* Sorting */
const sortedCities = R.sortWith([R.descend(city => city.score)], filteredCities);
// console.log(sortedCities);

/* Top 10 */
const top10 = R.take(10, sortedCities);
// console.log(top10);
// console.log(R.length(top10));

/* Pure Functions */
// function add(x, y) {
// 	return x + y;
// }
// Creates and return a values based only on the input parameters, causing no side effects
// Rules
// Have input parameters
// No stateful values
// Return based on input
// No side effects => permanent change, save to db, save to a file

/* Impure Functions */
// let counter = 0;
// function increment() {
// 	counter++;
// }
// Breake the rules

// Why use Pure Functions
// Reusable
// easy to test
// easy to catch
// composable

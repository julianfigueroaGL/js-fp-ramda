const R = require('ramda');
const table = require('text-table');
const cities = require('./cities.json');
const percentile = require('./percentile');

const toFahrenheit = 459.67;
const KtoF = k => k * (9 / 5) - toFahrenheit;
const updateTemperature = R.curry((covertFn, city) => {
	const temp = Math.round(covertFn(city.temp));
	return R.merge(city, { temp });
});
const updatedCities = R.map(updateTemperature(KtoF), cities);
const filterByWeather = city => {
	const { temp = 0, humidity = 0 } = city;
	return temp > 68 && temp < 85 && humidity > 30 && humidity < 70;
};
const groupByReducer = (acc, city) => {
	const { cost = 0, internetSpeed = [] } = acc;
	return R.mergeRight(acc, {
		cost: R.append(city.cost, cost),
		internetSpeed: R.append(city.internetSpeed, internetSpeed)
	});
};
const groupedByProp = R.reduce(groupByReducer, {}, updatedCities);
const calcScore = city => {
	const { cost = 0, internetSpeed = 0 } = city;
	const costPercentile = percentile(groupedByProp.cost, cost);
	const internetPercentile = percentile(groupedByProp.internetSpeed, internetSpeed);
	const score = 100 * (1.0 - costPercentile) + 20 * internetPercentile;
	return R.mergeRight(city, { score });
};

const cityToArray = city => {
	const { name, country, score, cost, temp, internetSpeed } = city;
	return [name, country, score, cost, temp, internetSpeed];
};

const interestingProps = ['Name', 'Country', 'Score', 'Cost', 'Temperture', 'Internet Speed'];

const topCities = R.pipe(
	R.map(updateTemperature(KtoF)),
	R.filter(filterByWeather),
	R.map(calcScore),
	R.sortWith([R.descend(city => city.score)]),
	R.take(10),
	R.map(cityToArray),
	R.prepend(interestingProps),
	table
)(cities);

console.log(topCities);

// Extend

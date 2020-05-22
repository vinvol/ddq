const blessed = require("blessed");
const contrib = require("blessed-contrib");
const request = require("request");
const fs = require("fs");

const { getStuff } = require("./lib/get-stuff");
const { getCredentials } = require("./lib/get-credentials");
const { getMetric } = require("./lib/get-metric");
const { getAggregator } = require("./lib/get-aggregator");
const { createInterface } = require("./lib/interface");
const { colors } = require("./lib/colors");

const from = 1553644800;
const to = 1590191999;

const makeGetMetricList = ({ apiKey, appKey }) => async ({ input = "e" }) => {
    const url =
        `https://api.datadoghq.com/api/v1/search?q=metrics:${input}` +
        `&api_key=${apiKey}` +
        `&application_key=${appKey}`;
    // console.log("ask", url);
    const datum = await getStuff(url);
    // console.log("found", datum.results.metrics.length);

    return { metricList: datum.results.metrics };
};

const doEverything = async () => {
    const { apiKey, appKey } = await getCredentials();

    const getMetricList = makeGetMetricList({ apiKey, appKey });

    const { metric } = await getMetric({ getMetricList });

    const scope = `{*}`;

    const { aggregator } = await getAggregator();

    const query = `${aggregator}:${metric}${scope}`;

    const url =
        `https://api.datadoghq.com/api/v1/query?query=` +
        encodeURIComponent(query) +
        `&from=${from}` +
        `&to=${to}` +
        `&api_key=${apiKey}` +
        `&application_key=${appKey}`;

    const datum = await getStuff(url);

    const { screen, Chart } = createInterface(query);
    let chartData = buildChartData(datum.series);
    Chart.setData(chartData);
    screen.render();
};

const format = (d) => {
    const o = new Date(d);
    return o.toLocaleDateString();
};

const buildChartData = (series) =>
    series.map((s, i) => ({
        title: s.scope,
        x: s.pointlist.map((p) => p[0]).map(format),
        y: s.pointlist.map((p) => p[1]),
        style: {
            line: colors[i],
        },
    }));

doEverything();

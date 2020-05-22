const inquirer = require("inquirer");
const stringScore = require("string-score");

inquirer.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt")
);

const getMetric = ({ getMetricList }) =>
    new Promise((res) => {
        const query = process.argv[3];

        inquirer
            .prompt([
                {
                    type: "autocomplete",
                    name: "metric",
                    message: "Select a metric to query from",
                    source: (answersSoFar, input = "") =>
                        new Promise((r) => {
                            getMetricList(input).then(({ metricList }) => {
                                const res = metricList
                                    .map((option) => ({
                                        opt: option,
                                        score: stringScore(option, input),
                                    }))
                                    .filter((x) => x.score > 0)
                                    .sort((a, b) => b.score - a.score)
                                    .map((x) => x.opt);

                                r(res);
                            });
                        }),
                },
            ])
            .then((answers) => {
                let { metric } = answers;
                res({ metric });
            })
            .catch((error) => console.error(error));
    });
module.exports = { getMetric };

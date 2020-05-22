const inquirer = require("inquirer");

inquirer.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt")
);
const getAggregator = () =>
    new Promise((res) => {
        inquirer
            .prompt([
                {
                    type: "autocomplete",
                    name: "aggregator",
                    message: "Show",
                    source: () =>
                        new Promise((r) => r(["sum", "avg", "min", "max"])),
                },
            ])
            .then((answers) => {
                let { aggregator } = answers;
                res({ aggregator });
            })
            .catch((error) => console.error(error));
    });

module.exports = { getAggregator };

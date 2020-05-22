const fs = require("fs");
const inquirer = require("inquirer");
const homedir = require("os").homedir();

inquirer.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt")
);

const getCredentials = () =>
    new Promise((res) => {
        let apiKey = process.argv[2];
        let appKey = process.argv[3];
        if (!apiKey || !appKey) {
            try {
                let { apiKey, appKey } = JSON.parse(
                    fs.readFileSync(`${homedir}/.ddq/credentials.json`)
                );
                if (apiKey && appKey) {
                    console.log(`Using the cached API key.`);
                    return res({ apiKey, appKey });
                }
            } catch (e) {
                console.error("no problem", e);
            }
        }
        try {
            if (!apiKey || !appKey) {
                console.log(
                    `You'll need an API and an App key -  https://app.datadoghq.com/account/settings#api`
                );
                inquirer
                    .prompt([
                        {
                            type: "password",
                            message: "Enter an API Key",
                            name: "apiKey",
                        },
                        {
                            type: "password",
                            message: "Enter an APP key",
                            name: "appKey",
                            mask: "*",
                        },
                    ])
                    .then((answers) => {
                        let { apiKey, appKey } = answers;
                        console.log({ answers });
                        try {
                            if (!fs.existsSync(`${homedir}/.ddq/`)) {
                                fs.mkdirSync(`${homedir}/.ddq/`);
                            }
                        } catch (e) {
                            console.error("no big deal", e);
                        }
                        try {
                            fs.writeFileSync(
                                `${homedir}/.ddq/credentials.json`,
                                JSON.stringify({ apiKey, appKey })
                            );
                        } catch (e) {
                            console.error("whatever", e);
                        }

                        res({ apiKey, appKey });
                    })
                    .catch((error) => console.error(error));
            }
        } catch (e) {
            console.error("oops", e);
        }
    });

module.exports = { getCredentials };

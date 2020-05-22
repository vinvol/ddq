const blessed = require("blessed");
const contrib = require("blessed-contrib");

let screen;
let Chart;

const createInterface = (metric) => {
    let padding = {
        left: 1,
        right: 1,
    };

    screen = blessed.screen({
        smartCSR: true,
        title: "DDQ",
        cursor: {
            artificial: true,
            shape: "line",
            blink: true,
            color: "red",
        },
    });

    const grid = new contrib.grid({
        rows: 36,
        cols: 36,
        screen: screen,
    });

    Chart = grid.set(0, 0, 36, 36, contrib.line, {
        style: { line: "yellow", text: "green", baseline: "black" },
        xLabelPadding: 10,
        showLegend: true,
        legend: { width: 40 },
        wholeNumbersOnly: false, //true=do not show fraction in y axis
        label: metric,
    });

    screen.on("resize", () => {
        Chart.emit("attach");
    });

    screen.key(["escape", "C-c"], (ch, key) => process.exit(0));
    return { screen, Chart };
};

module.exports = { createInterface };

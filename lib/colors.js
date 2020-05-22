const toColorArray = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
          ]
        : [255, 20, 20];
};

const colors = [
    "#3399cc",
    "#ab8fc7",
    "#81c0df",
    "#edbe01",
    "#FF0099",
    "#ffd528",
].map(toColorArray);

module.exports = { toColorArray, colors };

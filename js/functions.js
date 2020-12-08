function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
}

function createRandomIntegers(len, min, max) {
    var array = [];
    min = Math.ceil(min);
    max = Math.floor(max);
    for (var i = 0; i < len; i++) {
        let currentNum = Math.floor(Math.random() * (max - min + 1)) + min; //Il max è incluso e il min è incluso
        if (array.includes(currentNum)){
            i--;
        } else {
            array.push(currentNum);
        }
    };
    return array;
}
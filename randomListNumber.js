function generateList(length) {
    let array = [];
    for (let i = 1; i <= length; i++) {
        array.push(i);
    }
    return array;
}

function randomInRange(start, end) {
    return Math.floor(Math.random() * (end - start + 1) + start);
}

function generateListRandom(array) {
    let count = 0;
    for (const item of array) {
        let index = randomInRange(count, array.length - 1);

        let temp = array[count];
        array[count] = array[index];
        array[index] = temp;

        count++;
    }
    return [...array];
}

// console.log('RANDOM-LIST-NUMBER------------------------------------------------------\n');

// generateList(length, array);
// var start = new Date().getTime();
// generateListRandom(array);
// var end = new Date().getTime();
// var time = end - start;
// console.log('Execution generateListRandom time: ' + time + ' ms');

// console.log('\nRANDOM-LIST-NUMBER------------------------------------------------------\n');
export { generateList, generateListRandom, randomInRange};

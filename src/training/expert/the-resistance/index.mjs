export const alphabet = {
	A: '.-',
	B: '-...',
	C: '-.-.',
	D: '-..',
	E: '.',
	F: '..-.',
	G: '--.',
	H: '....',
	I: '..',
	J: '.---',
	K: '-.-',
	L: '.-..',
	M: '--',
	N: '-.',
	O: '---',
	P: '.--.',
	Q: '--.-',
	R: '.-.',
	S: '...',
	T: '-',
	U: '..-',
	V: '...-',
	W: '.--',
	X: '-..-',
	Y: '-.--',
	Z: '--..'
};

/**
 * TODO...
 */
export function solve (readline) {
	const morseCode = readline();
	const nbOfWords = readline();
	const map = {};
	let min = Infinity;
	let max = 0;

	for (let i = 0; i < nbOfWords; i++) {
		const wordAsMorseCode = wordToMorseCode(readline());

		if (!map[wordAsMorseCode]) map[wordAsMorseCode] = 1;
		else map[wordAsMorseCode]++;

		const length = wordAsMorseCode.length;
		if (length < min) min = length;
		if (length > max) max = length;
	}

	/**
	 * TODO:
	 * 1. Find all starting slice in the given starting
	 * Ex: '.' and '..' in the string '..-'
	 * 2. Use the number of option each string got.
	 * Ex: '...' have 2 options, `EI` and `IE`
	 * 3. Find the smallest solved length
	 * Repeate the process.
	 * 4. reduce the solution with the same length
	 * Repeate...
	 */

	// Sample of array to work with
	/*
	const sample = [
		{
			index: 10,
			nbOfSolution: 2
		}
	];
	*/

	// The reduction process use the index as a key. Then, the number of solution
	// should be added.

	// The merge process should eval a sample an split it in n new sample.
	/*
	const merged = [
		{
			word: '...',
			length: 3,
			value: 2
		},
		{
			word: '.',
			length: 1,
			value: 1
		}
	];
	*/

	// So, the new sample should look like this now
	/*
	const sampleBis = [
		{
			index: 10 + 3,
			nbOfSolution: 2 * 2
		},
		{
			index: 10 + 1,
			nbOfSolution: 2 * 1
		}
	];
	*/

	// If the eval process return an empty array and the index is different from
	// the length, this branch is dead... Remove it from the samples.

	// Once every branch match the length of the string, the reducer should add
	// them. So, at the end, only one item should stay. This is the solution
	// of the problem !

	// Init of the loop !!!
	let array = [
		{
			index: 0,
			nbOfSolution: 1
		}
	];
	let isProcessing = true;
	let i = 0;

	do {
		const smalest = array[0];
		let sub = extactSliceOfAllStartingOptions(morseCode, map, smalest.index, smalest.nbOfSolution, min, max);
		array = [...array.slice(1), ...sub]
			.reduce((acc, item) => {
				let indexed = acc.find(elm => elm.index === item.index);

				if (!!indexed) {
					indexed.nbOfSolution = indexed.nbOfSolution + item.nbOfSolution;

					return [...acc];
				} else {
					let newOne = Object.assign({}, item);

					return [...acc, newOne];
				}
			}, []);

		array.sort((itemA, itemB) => itemA.index < itemB.index ? -1 : 1);


		if (i >= 10000 || array.length === 0 || array.length === 1 && array[0].index === morseCode.length) {
			isProcessing = false;
		}
		i++;

	} while (isProcessing)

	return !!array[0] ? array[0].nbOfSolution : 0;
};

/**
 * Method to convert a word in morse code without space.
 * @param word The word to encode
 * @param apbt The alphabet to use to encode the word
 * @return The encoded word
 */
export function wordToMorseCode (word, apbt = alphabet) {
	return word.split('')
		.map(char => apbt[char])
		.join('');
};

/**
 * Method to extract the slice of all starting options.
 * @param str The string input in morse code
 * @param dicAsMap The dictionary as a map of usable word in morse code
 * @param start The index of start
 * @param nbOfSolution The previous number of solution
 * @param min The minimun index to eval
 * @param max The maximum index to eval
 * @return An array of possible starting slice
 */
export function extactSliceOfAllStartingOptions (str, dicAsMap, start, nbOfSolution, min, max) {
	const result = [];
	const limit = Math.min(max, str.length - start);

	for (let i = min; i <= limit; i++) {
		const word = str.slice(start, start + i);

		if (dicAsMap[word]) result.push({
			index: start + i,
			nbOfSolution: nbOfSolution * dicAsMap[word]
		});
	}

	return result;
}

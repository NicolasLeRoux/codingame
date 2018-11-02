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
	const mapOfWord = {};
	let min = Infinity;
	let max = 0;

	for (let i = 0; i < nbOfWords; i++) {
		const wordAsMorseCode = wordToMorseCode(readline());

		// Build map of word
		if (!mapOfWord[wordAsMorseCode]) mapOfWord[wordAsMorseCode] = 1;
		else mapOfWord[wordAsMorseCode]++;

		// Find longest and shortest word
		const length = wordAsMorseCode.length;
		if (length < min) min = length;
		if (length > max) max = length;
	}

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
		let sub = processMorseCodeAtIndex(morseCode,
			mapOfWord,
			smalest.index,
			smalest.nbOfSolution,
			min,
			max);

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

	} while (isProcessing);

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
 * Method to process the morse code with a dictionary at a given index.
 * @param str The string input in morse code
 * @param dicAsMap The dictionary as a map of usable word in morse code
 * @param start The index of start
 * @param nbOfSolution The previous number of solution
 * @param min The minimun index to eval
 * @param max The maximum index to eval
 * @return An array of processed index
 */
export function processMorseCodeAtIndex (str, dicAsMap, start, nbOfSolution, min, max) {
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

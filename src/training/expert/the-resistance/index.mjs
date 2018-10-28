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
	return 0;
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
 * Method to extract the index of all starting options.
 * @param str The string input in morse code
 * @param dicAsMap The dictionary as a map of usable word in morse code
 * @param min The minimun index to eval
 * @param max The maximum index to eval
 * @return An array of possible index
 */
export function extactIndexOfAllStartingOptions (str, dicAsMap, min, max) {
	const result = [];

	for (let i = min; i <= max; i++) {
		if (dicAsMap[str.slice(0, i)]) result.push(i);
	}

	return result;
}

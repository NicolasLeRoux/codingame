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

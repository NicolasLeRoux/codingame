/**
 * TODO
 */
export function solve (readline) {
	return '';
};

/**
 * Method to decode a image encode with DWE (Doctor Who Encoding).
 *
 * __Sample:__
 * - Given the input 'W 1 B 1' the expected result should be [0, 1]
 * - Given the input 'W 2 B 3' the expected result should be [0, 0, 1, 1, 1]
 * - Given the input 'W 1 B 2 W 1' the expected result should be [0, 1, 1, 0]
 *
 * @param encodedImage The DWE encoded image
 * @return A array of black or white pixel (0 for white and 1 for black)
 */
export function decodeDWE (encodedImage) {
	return encodedImage.split(' ')
		.reduce((acc, item, idx, array) => {
			let pixels = [];

			if (idx % 2 === 0) {
				pixels = Array.from({
						length: +array[idx + 1]
					})
					.map(() => item === 'B' ? 1 : 0);
			}

			return [...acc, ...pixels];
		}, []);
}
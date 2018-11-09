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
			const colorCode = item === 'B' ? 1 : 0;
			const length = idx % 2 === 0 ? +array[idx + 1] : 0;
			const pixels = Array.from({ length })
				.fill(colorCode);

			return [...acc, ...pixels];
		}, []);
}

/**
 * Method to evaluate a matching percent between an image and a pattern.
 *
 * __Sample:__
 * - Given [1, 1, 0, 0] and [1, 1, 0, 1] the expected result should be 0.75
 * - Given [0, 1, 0, 0] and [1, 1, 1, 1] the expected result should be 0.25
 * - Given [0, 1, 1, 1] and [undefined, 1, 0, undefined] the expected result
 * should be 0.75
 *
 * @param image The image to evaluate
 * @param pattern The pattern we are looking for
 * @return The percent of matching
 */
export function matchingPercent (image, pattern) {
	return image.reduce((acc, item, idx) => {
			const pixel = pattern[idx];
			const weight = item === pixel || pixel === undefined ? 1 : 0;

			return acc + weight;
		}, 0) / image.length;
}

/**
 * Method to crop an image.
 *
 * __Sample:__
 * - Given an image [0, 1, 2, 3, 4, 5, 6, 7, 8], a width of 2, a height of 2, an
 * x of 1 and an y of 1 the expected result should be [4, 5, 7, 8]
 *
 * @param image The image to evaluate
 * @param w The width of the image to process
 * @param h The height of the image to process
 * @param cw The width of the cropped image
 * @param ch The height of the cropped image
 * @param xo The offset to use on the horizontal axe
 * @param yo The offset to use on the vertical axe
 * @return The cropped image.
 */
export function cropImage (image, w = 0, h = 0, cw = 0, ch = 0, xo = 0, yo = 0) {
	const length = cw * ch;

	return Array.from({ length })
		.reduce((acc, _item, idx) => {
			const i = xo + idx % cw + (Math.floor(idx / cw) + yo) * w;

			return [...acc, image[i]];
		}, []);
}

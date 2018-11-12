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
	const chunks = encodedImage.split(' ')
		.map((item, idx, array) => {
			const colorCode = item === 'B' ? 1 : 0;
			const length = idx % 2 === 0 ? +array[idx + 1] : 0;
			return Array.from({ length })
				.fill(colorCode);
		});

	return [].concat(...chunks);
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
		.map((_item, idx) => {
			const x = idx % cw;
			const y = Math.floor(idx / cw);
			const i = x + xo + (y + yo) * w;

			return image[i];
		});
}

/**
 * Method to build the mask (or pattern) to find in the image.
 */
export function getMask () {
	const w = 22;
	const h = 21;
	const length = w * h;
	const mapOfPixel = new Map([
		// Row n°0
		[6, 1], [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1], [13, 1], [14, 1],
		[15, 1],
		// Row n°1
		[5 + w, 1], [6 + w, 1], [7 + w, 1], [8 + w, 1], [9 + w, 1], [10 + w, 1],
		[11 + w, 1], [12 + w, 1], [13 + w, 1], [14 + w, 1], [15 + w, 1], [16 + w, 1],
		// Row n°2
		[3 + w * 2, 1], [4 + w * 2, 1], [5 + w * 2, 1], [6 + w * 2, 1],
		[15 + w * 2, 1], [16 + w * 2, 1], [17 + w * 2, 1], [18 + w * 2, 1],
		// Row n°3
		[3 + w * 3, 1], [4 + w * 3, 1],
		[17 + w * 3, 1], [18 + w * 3, 1],
		// Row n°4
		[2 + w * 4, 1], [3 + w * 4, 1],
		[18 + w * 4, 1], [19 + w * 4, 1],
		// Row n°5
		[1 + w * 5, 1], [2 + w * 5, 1], [3 + w * 5, 1],
		[18 + w * 5, 1], [19 + w * 5, 1], [20 + w * 5, 1],
		// Row n°6
		[1 + w * 6, 1], [2 + w * 6, 1],
		[19 + w * 6, 1], [20 + w * 6, 1],
		// Row n°7
		[w * 7, 1], [1 + w * 7, 1], [2 + w * 7, 1],
		[19 + w * 7, 1], [20 + w * 7, 1], [21 + w * 7, 1],
		// Row n°8
		[w * 8, 1], [1 + w * 8, 1],
		[20 + w * 8, 1], [21 + w * 8, 1],
		// Row n°9
		[w * 9, 1], [1 + w * 9, 1],
		[20 + w * 9, 1], [21 + w * 9, 1],
		// Row n°10
		[w * 10, 1], [1 + w * 10, 1],
		[20 + w * 10, 1], [21 + w * 10, 1],
		// Row n°11
		[w * 11, 1], [1 + w * 11, 1],
		[20 + w * 11, 1], [21 + w * 11, 1],
		// Row n°12
		[w * 12, 1], [1 + w * 12, 1],
		[20 + w * 12, 1], [21 + w * 12, 1],
		// Row n°13
		[w * 13, 1], [1 + w * 13, 1], [2 + w * 13, 1],
		[19 + w * 13, 1], [20 + w * 13, 1], [21 + w * 13, 1],
		// Row n°14
		[1 + w * 14, 1], [2 + w * 14, 1],
		[19 + w * 14, 1], [20 + w * 14, 1],
		// Row n°15
		[1 + w * 15, 1], [2 + w * 15, 1], [3 + w * 15, 1],
		[18 + w * 15, 1], [19 + w * 15, 1], [20 + w * 15, 1],
		// Row n°16
		[2 + w * 16, 1], [3 + w * 16, 1],
		[18 + w * 16, 1], [19 + w * 16, 1],
		// Row n°17
		[3 + w * 17, 1], [4 + w * 17, 1],
		[17 + w * 17, 1], [18 + w * 17, 1],
		// Row n°18
		[3 + w * 18, 1], [4 + w * 18, 1], [5 + w * 18, 1], [6 + w * 18, 1],
		[15 + w * 18, 1], [16 + w * 18, 1], [17 + w * 18, 1], [18 + w * 18, 1],
		// Row n°19
		[5 + w * 19, 1], [6 + w * 19, 1], [7 + w * 19, 1], [8 + w * 19, 1], [9 + w * 19, 1],
		[10 + w * 19, 1], [11 + w * 19, 1], [12 + w * 19, 1], [13 + w * 19, 1], [14 + w * 19, 1],
		[15 + w * 19, 1], [16 + w * 19, 1],
		// Row n°20
		[6 + w * 20, 1], [7 + w * 20, 1], [8 + w * 20, 1], [9 + w * 20, 1], [10 + w * 20, 1],
		[11 + w * 20, 1], [12 + w * 20, 1], [13 + w * 20, 1], [14 + w * 20, 1], [15 + w * 20, 1]
	]);

	return Array.from({ length })
		.map((val, idx) => mapOfPixel.get(idx));
}

/**
 * Method to calcul the number of black pixel on each row.
 * @param image The image to evaluate
 * @param w The width of the image
 * @param h The height of the image
 * @return An array of the number of black pixel
 */
export function calculNbOfBlackPixelOnEachRow (image, w = 0, h = 0) {
	return Array.from({ length: h })
		.map((_, ih) => {
			return Array.from({ length: w })
				.reduce((acc, _, iw) => {
					return acc + image[iw + w * ih];
				}, 0);
		});
}

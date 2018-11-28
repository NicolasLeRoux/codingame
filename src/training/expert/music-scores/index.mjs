/**
 * TODO
 */
export function solve (readline) {
	const [w, h] = readline().split(' ');
	const encodedImage = readline();
	const image = decodeDWE(encodedImage);

	const histogramX = calculNbOfBlackPixelOnEachRow(image, w, h);
	const thresholdX = 0.8 * Math.max(...histogramX);
	//console.log(thresholdX);
	const staffIdx = histogramX.reduce((acc, val, idx) => {
		return val > thresholdX ? [...acc, idx] : [...acc];
	}, []);
	const groupedStaffIdx = staffIdx.reduce((acc, val, idx, array) => {
		if (val - 1 === array[idx - 1]) {
			return [...acc.slice(0, -1), [...acc.slice(-1)[0], val]];
		} else {
			return [...acc, [val]];
		}
	}, []);
	const staffGutter = groupedStaffIdx[1][0] - groupedStaffIdx[0].slice(-1)[0];
	const staffLength = groupedStaffIdx[1].length;
	const missingStaff = groupedStaffIdx.slice(-1)[0].map(val => val + staffGutter + staffLength - 1);
	const groupedStaffIdxFull = [...groupedStaffIdx, missingStaff];
	const staffIdxFull = [].concat(...groupedStaffIdxFull);
	// console.log(staffIdxFull);

	const histogramY = calculNbOfBlackPixelOnEachCol(image, w, h);
	const histogramYWthStaffs = calculNbOfBlackPixelOnEachCol(image, w, h, staffIdxFull);
	const thresholdY = 0.8 * Math.max(...histogramY);
	//console.log(thresholdY);
	//console.log(histogramYWthStaffs);

	const tails = histogramY.reduce((acc, val, idx) => {
			if (val > thresholdY) {
				return [...acc, idx];
			} else {
				return [...acc];
			}
		}, [])
		.reduce((acc, val, idx, array) => {
			if (val - 1 === array[idx - 1]) {
				return [...acc.slice(0, -1), [...acc.slice(-1)[0], val]];
			} else {
				return [...acc, [val]];
			}
		}, []);
	const tailLength = tails[0].length;

	const chunks = tails.map((val, idx, array) => {
			const ratio = val.length * 10;
			const first = val[0];
			const last = val.slice(-1)[0];
			const start = array[idx - 1] ? Math.max(first - ratio, array[idx - 1].slice(-1)[0]) : Math.max(first - ratio, 0);
			const end = array[idx + 1] ? Math.min(last + ratio, array[idx + 1][0]) : Math.min(last + ratio, w);

			// Here, I need to shorten my range in order to avoid close note. To
			// do so, I have to find the direction of the note.
			if (histogramYWthStaffs[first - 1] === 0) {
				//console.log('Right note.');
				return [last + 1, end];
			} else {
				//console.log('Left note.');
				return [start, first - 1];
			}
			//return [start, end];
		})
		.map(array => {
			const cw = array[1] - array[0];
			const crop = cropImage(image, w, h, cw, h, array[0], 0);
			const cropHistogramX = calculNbOfBlackPixelOnEachRow(crop, cw, h);

			return cropHistogramX.map((val, idx, array) => {
					return staffIdxFull.includes(idx) ? -1 : val;
				});
		})
		.map((histogramX) => {
			const noteIdxs = histogramX.map((val, idx) => val > 0 ? idx : 0)
				.filter(val => !!val);
			const noteDiameter = noteIdxs.slice().pop() - noteIdxs[0] + 1;
			const noteNbPixel = histogramX.filter(val => !!val)
				.reduce((acc, val) => acc + val);
			const isFull = noteNbPixel > (noteDiameter ** 2 / 2);
			const centerIdx = noteIdxs[0] + Math.floor(noteDiameter / 2) - 1;
			const isCenterOnStaff = staffIdxFull.includes(centerIdx);

			//console.log('histogramX', histogramX);
			//console.log('isFull:', isFull);
			//console.log('maxIdxs:', maxIdxs);
			//console.log('center:', centerIdx);
			//console.log('isFull:', isFull);
			//console.log('staffs:', groupedStaffIdxFull);

			let letter;
			if (centerIdx < groupedStaffIdxFull[0][0]) {
				letter = 'G';
			} else if (centerIdx <= groupedStaffIdxFull[0].slice().pop()) {
				letter = 'F';
			} else if (centerIdx < groupedStaffIdxFull[1][0]) {
				letter = 'E';
			} else if (centerIdx <= groupedStaffIdxFull[1].slice().pop()) {
				letter = 'D';
			} else if (centerIdx < groupedStaffIdxFull[2][0]) {
				letter = 'C';
			} else if (centerIdx <= groupedStaffIdxFull[2].slice().pop()) {
				letter = 'B';
			} else if (centerIdx < groupedStaffIdxFull[3][0]) {
				letter = 'A';
			} else if (centerIdx <= groupedStaffIdxFull[3].slice().pop()) {
				letter = 'G';
			} else if (centerIdx < groupedStaffIdxFull[4][0]) {
				letter = 'F';
			} else if (centerIdx <= groupedStaffIdxFull[4].slice().pop()) {
				letter = 'E';
			} else if (centerIdx < groupedStaffIdxFull[5][0]) {
				letter = 'D';
			} else if (centerIdx <= groupedStaffIdxFull[5].slice().pop()) {
				letter = 'C';
			}

			return letter + (isFull ? 'Q' : 'H');
		});

	return chunks.join(' ');
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

/**
 * Method to calcul the number of black pixel on each col.
 * @param image The image to evaluate
 * @param w The width of the image
 * @param h The height of the image
 * @return An array of the number of black pixel
 */
export function calculNbOfBlackPixelOnEachCol (image, w = 0, h = 0, skips = []) {
	return Array.from({ length: w })
		.map((_, iw) => {
			return Array.from({ length: h })
				.reduce((acc, _, ih) => {
					if (skips.includes(ih)) {
						return acc;
					} else {
						return acc + image[iw + w * ih];
					}
				}, 0);
		});
}

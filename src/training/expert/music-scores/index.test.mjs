import chai from 'chai';
import fs from 'fs';
import path from 'path';
import {
	solve,
	decodeDWE,
	matchingPercent,
	cropImage,
	sumBlackPixelOnEachRow,
	sumBlackPixelOnEachCol,
	getMaxIndexes,
	groupAdjacentNumber
} from './index.mjs';

const { expect } = chai;
const __dirname = path.resolve(path.dirname(''), 'src/training/expert/music-scores');

describe(`In 'Music Scores' puzzle,`, () => {
	describe(`The 'solve' method,`, () => {
		const tests = [
			{
				fileName: 'test01.txt',
				executionTimeMs: 25,
				expected: 'AQ'
			},
			{
				fileName: 'test02.txt',
				executionTimeMs: 25,
				expected: 'BQ'
			},
			{
				fileName: 'test03.txt',
				executionTimeMs: 25,
				expected: 'AH'
			},
			{
				fileName: 'test04.txt',
				executionTimeMs: 25,
				expected: 'BH'
			},
			{
				fileName: 'test05.txt',
				executionTimeMs: 90,
				expected: 'CQ CQ CQ CQ DQ EQ CQ AQ'
			},
			{
				fileName: 'test06.txt',
				executionTimeMs: 80,
				expected: 'DH EH FH AH CH EH DH'
			},
			{
				fileName: 'test07.txt',
				executionTimeMs: 90,
				expected: 'EQ FH GQ AH BQ CH DQ EH FQ'
			},
			{
				fileName: 'test08.txt',
				executionTimeMs: 100,
				expected: 'CQ CQ CQ DQ EH DH CQ EQ DQ DQ CH'
			},
			{
				fileName: 'test09.txt',
				executionTimeMs: 110,
				expected: 'BQ CH DH EH FQ GQ GQ BQ DH BQ'
			},
			{
				fileName: 'test10.txt',
				executionTimeMs: 40,
				expected: 'BQ CH DH EH FQ GQ GQ BQ DH BQ BQ CH DH EH FQ GQ GQ BQ DH BQ'
			},
			{
				fileName: 'test11.txt',
				executionTimeMs: 1300,
				expected: 'CH CQ DQ CH EH CQ CQ AQ CH EQ DH CQ CQ DH CQ DQ CH CQ DQ EQ FQ AQ BQ CQ DQ EQ FQ GH CH CQ DQ CH EH CQ CQ AQ CH EQ DH CQ CQ DH CQ DQ CH CQ DQ EQ FQ AQ BQ CQ DQ EQ FQ GH CH CQ DQ CH EH CQ CQ AQ CH EQ DH CQ CQ DH CQ DQ CH CQ DQ EQ FQ AQ BQ CQ DQ EQ FQ GH'
			},
			{
				fileName: 'test12.txt',
				executionTimeMs: 1300,
				expected: 'FH CH EQ BQ EH EH FQ AQ CH AQ EH DQ DQ CH EH CH FQ EQ CQ GH CH EQ FQ EH BQ GH BH FQ CQ FH AH DH GQ AH DQ FH FQ GH DH CH EQ GH EH EH GH BH GQ BH FH CQ CQ FH DH BH EQ CQ GQ CQ DH FH AH FQ CH DH FH EQ EQ BH DQ FQ GQ DH CH GH FQ EH CQ EQ AQ GQ DH EQ CQ FH AQ DQ FH AH FQ EQ'
			}
		];

		const generator = function* (widthAndHeight, encodedImage) {
			yield widthAndHeight;
			yield encodedImage;
		};

		const readline = function (fileName) {
			const txt = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8')
				.replace(/\n$/, '');
			const array = txt.split(/\n/);
			const iterator = generator(array[0], array[1]);

			return () => iterator.next().value;
		};

		tests.forEach((item) => {
			describe(`Given the input file ${item.fileName},`, () => {
				const expectedNotes = item.expected.split(' ');
				const result = solve(readline(item.fileName));
				const notes = result.split(' ');

				it(`Should run in less than ${item.executionTimeMs} ms.`, () => {
					const time = process.hrtime();
					solve(readline(item.fileName));
					const diff = process.hrtime(time);
					const ms = diff[0] * 1e3 + Math.ceil(diff[1] / 1e6);

					expect(ms).to.be.below(item.executionTimeMs);
				});

				expectedNotes.forEach((note, idx) => {
					it(`Should return '${note}' for the ${idx + 1}th note.`, () => {
						expect(notes[idx]).to.equal(note);
					});
				});
			});
		});
	});

	describe(`The 'decodeDWE' method,`, () => {
		const tests = [
			{
				encodedImage: 'W 1 B 1',
				expected: [0, 1]
			},
			{
				encodedImage: 'W 2 B 3',
				expected: [0, 0, 1, 1, 1]
			},
			{
				encodedImage: 'W 1 B 2 W 1',
				expected: [0, 1, 1, 0]
			},
			{
				encodedImage: 'W 2 B 1 W 1 B 3',
				expected: [0, 0, 1, 0, 1, 1, 1]
			}
		];

		tests.forEach((item) => {
			it(`Should return [${item.expected}] given the following encoded image '${item.encodedImage}'.`, () => {
				const image = decodeDWE(item.encodedImage);

				expect(image).to.eql(item.expected);
			});
		});
	});

	describe(`The 'matchingPercent' method,`, () => {
		const tests = [
			{
				image: [1, 1, 0, 0],
				pattern: [1, 1, 0, 1],
				expected: 0.75
			},
			{
				image: [0, 1, 0, 0],
				pattern: [1, 1, 1, 1],
				expected: 0.25
			},
			{
				image: [0, 1, 1, 1],
				pattern: [undefined, 1, 0, undefined],
				expected: 0.75
			},
			{
				image: [1, 0, 1, 0],
				pattern: [0, 1, 0, 1],
				expected: 0
			},
			{
				image: [1, 0, 1, 0],
				pattern: [1, 0, 1, 0],
				expected: 1
			},
			{
				image: [1, 1, 1, 1],
				pattern: [0, 1, 0, 1],
				expected: 0.5
			},
			{
				image: [1, 0, 1, 0],
				pattern: [1, undefined, 1, undefined],
				expected: 1
			}
		];

		tests.forEach((item) => {
			it(`Should return ${item.expected * 100} % with the given inputs.`, () => {
				const percent = matchingPercent(item.image, item.pattern);

				expect(percent).to.equal(item.expected);
			});
		});
	});

	describe(`The 'cropImage' method,`, () => {
		const tests = [
			{
				image: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				w: 3,
				h: 3,
				cw: 2,
				ch: 2,
				xo: 1,
				yo: 1,
				expected: [4, 5, 7, 8]
			},
			{
				image: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				w: 3,
				h: 3,
				cw: 0,
				ch: 0,
				xo: 1,
				yo: 1,
				expected: []
			},
			{
				image: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				w: 3,
				h: 3,
				cw: 1,
				ch: 3,
				xo: 1,
				yo: 0,
				expected: [1, 4, 7]
			},
			{
				image: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				w: 3,
				h: 3,
				cw: 3,
				ch: 1,
				xo: 0,
				yo: 2,
				expected: [6, 7, 8]
			},
			{
				image: [0, 1, 2, 3, 4, 5, 6, 7, 8],
				w: 3,
				h: 3,
				cw: 2,
				ch: 2,
				xo: 2,
				yo: 2,
				expected: [8, undefined, undefined, undefined]
			}
		];

		tests.forEach((item) => {
			it(`Should return [${item.expected}] with the given inputs.`, () => {
				const percent = cropImage(item.image, item.w, item.h, item.cw, item.ch, item.xo, item.yo);

				expect(percent).to.eql(item.expected);
			});
		});
	});

	describe(`The 'sumBlackPixelOnEachRow' method,`, () => {
		const tests = [
			{
				image: [0, 0, 0, 0],
				w: 0,
				h: 0,
				expected: []
			},
			{
				image: [0, 1, 0, 1],
				w: 2,
				h: 2,
				expected: [1, 1]
			},
			{
				image: [1, 1, 0, 0],
				w: 2,
				h: 2,
				expected: [2, 0]
			},
			{
				image: [0, 1, 1, 1, 0, 0, 0, 1],
				w: 4,
				h: 2,
				expected: [3, 1]
			}
		];

		tests.forEach((item) => {
			it(`Should have [${item.expected}] as number of black pixel on each row.`, () => {
				const heigths = sumBlackPixelOnEachRow(item.image, item.w, item.h);

				expect(heigths).to.eql(item.expected);
			});
		});
	});

	describe(`The 'sumBlackPixelOnEachCol' method,`, () => {
		const tests = [
			{
				image: [0, 0, 0, 0],
				w: 0,
				h: 0,
				expected: []
			},
			{
				image: [0, 1, 0, 1],
				w: 2,
				h: 2,
				expected: [0, 2]
			},
			{
				image: [1, 1, 0, 0],
				w: 2,
				h: 2,
				expected: [1, 1]
			},
			{
				image: [0, 1, 1, 1, 0, 0, 0, 1],
				w: 4,
				h: 2,
				expected: [0, 1, 1, 2]
			}
		];

		tests.forEach((item) => {
			it(`Should have [${item.expected}] as number of black pixel on each col.`, () => {
				const heigths = sumBlackPixelOnEachCol(item.image, item.w, item.h);

				expect(heigths).to.eql(item.expected);
			});
		});
	});

	describe(`The 'getMaxIndexes' method,`, () => {
		const tests = [
			{
				array: [],
				factorOfSafety: 0,
				expected: []
			},
			{
				array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				factorOfSafety: 0,
				expected: [10]
			},
			{
				array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				factorOfSafety: 20,
				expected: [8, 9, 10]
			},
			{
				array: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
				factorOfSafety: 50,
				expected: [0, 1, 2, 3, 4, 5]
			}
		];

		tests.forEach((item) => {
			it(`Should return [${item.expected}] given a factor of safety of ${item.factorOfSafety}%.`, () => {
				const array = getMaxIndexes(item.array, item.factorOfSafety);

				expect(array).to.eql(item.expected);
			});
		});
	});

	describe(`The 'groupAdjacentNumber' method,`, () => {
		const tests = [
			{
				array: [],
				expected: []
			},
			{
				array: [1, 2, 3],
				expected: [[1, 2, 3]]
			},
			{
				array: [1, 2, 4, 5],
				expected: [[1, 2], [4, 5]]
			}
		];

		tests.forEach((item) => {
			it(`Should return ${item.expected.length} groups with the input [${item.array}].`, () => {
				const array = groupAdjacentNumber(item.array);

				expect(array).to.eql(item.expected);
			});
		});
	});
});

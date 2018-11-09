import chai from 'chai';
import fs from 'fs';
import path from 'path';
import {
	solve,
	decodeDWE,
	matchingPercent,
	cropImage
} from './index.mjs';

const { expect } = chai;
const __dirname = path.resolve(path.dirname(''), 'src/training/expert/music-scores');

describe(`In 'Music Scores' puzzle,`, () => {
	describe(`The 'solve' method,`, () => {
		const tests = [
			{
				fileName: 'test01.txt',
				expected: 'AQ'
			},
			{
				fileName: 'test02.txt',
				expected: 'BQ'
			},
			{
				fileName: 'test03.txt',
				expected: 'AH'
			},
			{
				fileName: 'test04.txt',
				expected: 'BH'
			},
			{
				fileName: 'test05.txt',
				expected: 'CQ CQ CQ CQ DQ EQ CQ AQ'
			},
			{
				fileName: 'test06.txt',
				expected: 'DH EH FH AH CH EH DH'
			},
			{
				fileName: 'test07.txt',
				expected: 'EQ FH GQ AH BQ CH DQ EH FQ'
			},
			{
				fileName: 'test08.txt',
				expected: 'CQ CQ CQ DQ EH DH CQ EQ DQ DQ CH'
			},
			{
				fileName: 'test09.txt',
				expected: 'BQ CH DH EH FQ GQ GQ BQ DH BQ'
			},
			{
				fileName: 'test10.txt',
				expected: 'BQ CH DH EH FQ GQ GQ BQ DH BQ BQ CH DH EH FQ GQ GQ BQ DH BQ'
			},
			{
				fileName: 'test11.txt',
				expected: 'CH CQ DQ CH EH CQ CQ AQ CH EQ DH CQ CQ DH CQ DQ CH CQ DQ EQ FQ AQ BQ CQ DQ EQ FQ GH CH CQ DQ CH EH CQ CQ AQ CH EQ DH CQ CQ DH CQ DQ CH CQ DQ EQ FQ AQ BQ CQ DQ EQ FQ GH CH CQ DQ CH EH CQ CQ AQ CH EQ DH CQ CQ DH CQ DQ CH CQ DQ EQ FQ AQ BQ CQ DQ EQ FQ GH'
			},
			{
				fileName: 'test12.txt',
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
			it(`Should return ${item.expected} with the given inputs.`, () => {
				const result = solve(readline(item.fileName));

				expect(result).to.equal(item.expected);
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
});

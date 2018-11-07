import chai from 'chai';
import fs from 'fs';
import path from 'path';
import {
	solve
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
});

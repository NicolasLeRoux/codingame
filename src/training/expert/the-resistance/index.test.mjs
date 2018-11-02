import chai from 'chai';
import fs from 'fs';
import path from 'path';
import {
	solve,
	wordToMorseCode,
	processMorseCodeAtIndex
} from './index.mjs';

const { expect } = chai;
const __dirname = path.resolve(path.dirname(''), 'src/training/expert/the-resistance');

describe(`In 'The Resistance' puzzle,`, () => {
	describe(`The 'solve' method,`, () => {
		const tests = [
			{
				fileName: 'test01.txt',
				expected: 1
			},
			{
				fileName: 'test02.txt',
				expected: 1
			},
			{
				fileName: 'test03.txt',
				expected: 2
			},
			{
				fileName: 'test04.txt',
				expected: 57330892800
			}
		];

		const generator = function* (morseCode, nbOfWords, words) {
			yield morseCode;
			yield nbOfWords;
			yield* words;
		};

		const readline = function (fileName) {
			const txt = fs.readFileSync(path.resolve(__dirname, fileName), 'UTF-8')
				.replace(/\n$/, '');
			const array = txt.split(/\n/);
			const iterator = generator(array[0], array[1], array.slice(2));

			return () => iterator.next().value;
		};

		tests.forEach((item) => {
			it(`Should return ${item.expected} with the given inputs.`, () => {
				const result = solve(readline(item.fileName));

				expect(result).to.equal(item.expected);
			});
		});
	});

	describe(`The 'wordToMorseCode' method,`, () => {
		const tests = [
			{
				word: 'A',
				expected: '.-'
			},
			{
				word: 'HELLO',
				expected: '......-...-..---'
			},
			{
				word: 'WORLD',
				expected: '.-----.-..-..-..'
			}
		];

		tests.forEach((item) => {
			it(`Should return ${item.expected} given the word ${item.word}.`, () => {
				const morse = wordToMorseCode(item.word);

				expect(morse).to.equal(item.expected);
			});
		});
	});

	describe(`The 'processMorseCodeAtIndex' method,`, () => {
		it(`Should return an empty array given an empty string.`, () => {
			const array = processMorseCodeAtIndex('', {}, 0, 0, [1, 2]);

			expect(array.length).to.equal(0);
		});

		it(`Should return an empty array given an empty dictionary.`, () => {
			const array = processMorseCodeAtIndex('.--.', {}, 0, 0, [1, 2]);

			expect(array.length).to.equal(0);
		});

		it(`Should return an empty array given a null max.`, () => {
			const array = processMorseCodeAtIndex('.--.', {
				'.': 1
			}, 0, 0, [0]);

			expect(array.length).to.equal(0);
		});

		it(`Should return an array of 4 items with the given inputs.`, () => {
			const array = processMorseCodeAtIndex('....', {
				'.': 1,
				'..': 1,
				'...': 2,
				'....': 4
			}, 0, 1, [1, 2, 3, 4]);

			expect(array).to.eql([
				{
					index: 1,
					nbOfSolution: 1
				},
				{
					index: 2,
					nbOfSolution: 1
				},
				{
					index: 3,
					nbOfSolution: 2
				},
				{
					index: 4,
					nbOfSolution: 4
				}
			]);
		});

		it(`Should return an array of 2 items with the given inputs.`, () => {
			const array = processMorseCodeAtIndex('....', {
				'.': 1,
				'..': 5,
				'...': 3,
				'....': 2
			}, 0, 1, [2, 3]);

			expect(array).to.eql([
				{
					index: 2,
					nbOfSolution: 5
				},
				{
					index: 3,
					nbOfSolution: 3
				}
			]);
		});

		it(`Should return an array of 2 items with the given inputs (bis).`, () => {
			const array = processMorseCodeAtIndex('....', {
				'.': 1,
				'..': 5,
				'...': 3,
				'....': 2
			}, 0, 3, [2, 3]);

			expect(array).to.eql([
				{
					index: 2,
					nbOfSolution: 15
				},
				{
					index: 3,
					nbOfSolution: 9
				}
			]);
		});

		it(`Should return only one element even if the max go over the string length.`, () => {
			const array = processMorseCodeAtIndex('..', {
				'..': 1
			}, 0, 1, [1, 2, 3]);

			expect(array).to.eql([
				{
					index: 2,
					nbOfSolution: 1
				}
			]);
		});
	});
});

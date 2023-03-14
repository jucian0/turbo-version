import {describe, expect, test} from '@jest/globals';
import { fileExist, readFile, readJsonFile, writeFile, resolvePkgPath } from '../../src/utils/FileSystem';

describe('fileExist', () => {
  test('returns true when file exists', () => {
    expect(fileExist('example.txt')).toBe(true);
  });

  test('returns false when file does not exist', () => {
    expect(fileExist('non-existent.txt')).toBe(false);
  });
});

describe('readFile', () => {
  test('reads file contents correctly', async () => {
    const data = await readFile('example.txt');
    expect(data).toBe('example file contents');
  });
});

describe('readJsonFile', () => {
  test('reads JSON file contents correctly', () => {
    const data = readJsonFile<{ name: string }>('example.json');
    expect(data.name).toBe('John');
  });

  test('returns an empty object when file is not valid JSON', () => {
    const data = readJsonFile<{ name: string }>('non-json.txt');
    expect(data).toEqual({});
  });
});

describe('writeFile', () => {
  test('writes data to file correctly', async () => {
    const filePath = 'test.txt';
    const data = 'test file contents';
    await writeFile(filePath, data);
    const fileContents = await readFile(filePath);
    expect(fileContents).toBe(data);
  });
});

describe('resolvePkgPath', () => {
  test('returns correct path relative to cwd', () => {
    const path = resolvePkgPath('src/index.ts');
    expect(path).toBe(`${process.cwd()}/src/index.ts`);
  });
});

import { canHuShape } from './judge';

test('can hu', () => {
  expect(canHuShape({
    '12': 1,
    '13': 1,
    '14': 1,
    '17': 1,
    '18': 1,
    '19': 1,
    '23': 2,
    '34': 1,
    '35': 1,
    '36': 1,
    '47': 3,
  })).toBe(true);
});

test('hu with not full', () => {
  expect(canHuShape({
    '12': 3,
    '13': 2,
    '14': 3,
    '15': 2,
    '16': 1,
  })).toBe(true);
});

test('can not hu', () => {
  expect(canHuShape({
    '12': 1,
    '13': 1,
    '14': 1,
    '17': 1,
    '18': 1,
    '19': 1,
    '23': 2,
    '34': 1,
    '35': 1,
    '39': 1,
    '47': 3,
  })).toBe(false);
});

test('hu with 13 yao', () => {
  expect(canHuShape({
    '11': 1,
    '19': 1,
    '21': 1,
    '29': 1,
    '31': 1,
    '39': 1,
    '41': 1,
    '43': 1,
    '45': 1,
    '47': 1,
    '51': 1,
    '53': 2,
    '55': 1,
  })).toBe(true);
});

test('hu with 7 pairs', () => {
  expect(canHuShape({
    '12': 2,
    '14': 2,
    '17': 2,
    '19': 2,
    '23': 2,
    '47': 4,
  })).toBe(true);
  expect(canHuShape({
    '12': 2,
    '14': 2,
    '47': 4,
  })).toBe(false);
});

// tests/simple.test.js
describe('Simple Test', () => {
    it('should add numbers correctly', () => {
      const sum = (a, b) => a + b;
      expect(sum(1, 2)).toBe(3);
    });
  });
  
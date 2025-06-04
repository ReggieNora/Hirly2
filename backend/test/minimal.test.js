// Minimal test without any dependencies
describe('Minimal Test', function() {
  it('should pass', function() {
    if (1 + 1 !== 2) {
      throw new Error('Test failed!');
    }
  });
});

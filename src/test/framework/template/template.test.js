import { it, assert, assertEqualObj } from '/src/test/framework/test_util.js';


export function test_dummy() {
    it(`Dummy test 1`, () => {
        assertEqualObj("a", "b");
    });

    it(`Dummy test 2`, () => {
        assert(false);
    });
    it(`Dummy test 3`, () => {
        assert(true);
    });
}
import { expect, test as base } from "../test";

/**
 * toolshop's test data — bound clients of the signed-in role and disposable data (created before the
 * test, removed after) that its specs need without testing them. Only toolshop's tests see these; the
 * shared chain under src/fixtures/ is the template's and never edited.
 */
export const test = base.extend({});

export { expect };

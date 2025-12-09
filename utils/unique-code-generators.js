import { getRandomValues } from "crypto";

/**
 * Generate password with given characters
 * - allow special characters; add  ~!@-#$ at the end of characters param
 * @param {number} length
 * @param {string} characters
 * @returns {string}
 */
export const passwordGenerator = (
  length = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
) =>
  Array.from(getRandomValues(new Uint32Array(length)))
    .map(x => characters[x % characters.length])
    .join("");

/**
 * Generate unique code with given characters[default numbers, 8 length]
 * @param {number} length
 * @param {string} characters
 * @returns {string}
 */
export const uniqueCodeGenerator = (
  length = 8,
  characters = "1234567890",
) =>
  Array.from(getRandomValues(new Uint32Array(length)))
    .map(x => characters[x % characters.length])
    .join("");

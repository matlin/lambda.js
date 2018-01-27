/* 
* LAMBDA CALCULUS 
*      and
* CHURCH ENCODINGS
*/

// Boolean Encodings
const True = (a, b) => a;
const False = (a, b) => b;
const And = (a, b) => b(a, b);
const Or = (a, b) => a(a, b);
const Not = a => a(False, True);
const Xor = (a, b) => a(Not(b), b);

const toBinary = bool => bool(1, 0);
const toBool = bit => (+bit === 0 ? False : True);

//Numerals
//any number, n, is defined as the successor to n-1
const Succ = n => f => x => f(n(f)(x));
const Zero = f => a => a;
const One = Succ(Zero);

//Math with binary numbers made with booleans
const addBools = (a, b, carry = False) => {
  const val = Xor(Xor(a, b), carry);
  const newCarry = a(Or(b, carry), And(b, carry));
  return { val, newCarry };
};

const foldr = (a, func) => a.reduceRight(func);

const foldTwoR = (a, b, func) => {
  if (a.length !== b.length)
    throw new Error("Cannot fold lists of different length");
  return a
    .map((aItem, i) => [aItem, b[i]])
    .reduceRight((acc, [itemA, itemB]) => func(itemA, itemB));
};

function addListBools(a, b) {
  return addListBoolsReverse(a.reverse(), b.reverse(), False).reverse();
}

function addListBoolsReverse(a, b, carry = False) {
  if (a.length !== b.length) throw new Error("lists must be same length");
  if (a.length === 0 && b.length === 0) {
    return carry([True], []);
  }
  const [aItem, ...aRest] = a;
  const [bItem, ...bRest] = b;
  const { val, newCarry } = addBools(aItem, bItem, carry);
  return [val, ...addListBoolsReverse(aRest, bRest, newCarry)];
}

function addBinary(a, b) {
  return addListBools(a.split("").map(toBool), b.split("").map(toBool))
    .map(toBinary)
    .join("");
}

function map(func, [val, ...rest]) {
  if (rest.length === 0) return [func(val)];
  return [func(val), ...map(func, rest)];
}

function dec2bin(dec) {
  const valString = (dec >>> 0).toString(2);
  const padding = new Array(32 - valString.length).fill("0").join("");
  return padding + valString;
}

function addNumbers(a, b) {
  return parseInt(addBinary(dec2bin(a), dec2bin(b)), 2);
}

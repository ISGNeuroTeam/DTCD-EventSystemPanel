function firstCharIsNotNumber(value) {
  return !!isNaN(value[0]);
};

function notEqualToReserveWords(value) {
  if (value === 'undefined'
    || value === 'null'
    || value === 'NaN'
    || value === 'true'
    || value === 'false'
    || value === 'Boolean'
    || value === 'Object'
    || value === 'Class'
    || value === 'Number'
    || value === 'String'
    || value === 'Array'
    || value === 'Map'
    || value === 'Set'
    || value === 'WeakMap'
    || value === 'WeakSet'
    || value === 'Error'
    || value === 'var'
    || value === 'let'
    || value === 'const'
    || value === 'function'
    || value === 'Function'
    || value === 'interface'
    || value === 'export'
    || value === 'import'
    || value === 'new'
    || value === 'this'
    || value === 'setTimeout'
    || value === 'setInterval'
    || value === 'instanceof'
    || value === 'typeof'
    || value === 'try'
    || value === 'catch'
    || value === 'finally'
    || value === 'throw'
    || value === 'async'
    || value === 'await'
    || value === 'BigInt'
    || value === 'window'
    || value === 'for'
    || value === 'while'
    || value === 'do'
    || value === 'continue'
    || value === 'if'
    || value === 'else'
    || value === 'switch'
    || value === 'case'
    || value === 'break'
    || value === 'alert'
    || value === 'confirm'
    || value === 'super'
    || value === 'static'
    || value === 'return'
  ) {
    return false;
  }

  return true;
}

function hasntSpecialChars(value) {
  return !/[\n\r\'\"\\\t\b\f\v\|\/ -;:@#^&?,.!*+`~\(\)\[\]\{\}]/.test(value);
}

export {
  firstCharIsNotNumber,
  notEqualToReserveWords,
  hasntSpecialChars,
};
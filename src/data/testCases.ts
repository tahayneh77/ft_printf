export interface TestCase {
  id: string;
  category: 'c' | 's' | 'p' | 'd_i' | 'u' | 'x_X' | 'percent' | 'mixed';
  title: string;
  format: string;
  args: any[];
  argsRepresentation: string;
  description: string;
}

export const TEST_CASES: TestCase[] = [
  // %c Cases
  {
    id: 'c-1',
    category: 'c',
    title: 'Single ASCII character',
    format: '%c',
    args: ['a'],
    argsRepresentation: "'a'",
    description: 'Basic alphabetic character output',
  },
  {
    id: 'c-2',
    category: 'c',
    title: 'Digit character',
    format: '%c',
    args: ['7'],
    argsRepresentation: "'7'",
    description: 'Character representing digit',
  },
  {
    id: 'c-3',
    category: 'c',
    title: 'Space character',
    format: ' [%c] ',
    args: [' '],
    argsRepresentation: "' '",
    description: 'Whitespace printing',
  },
  {
    id: 'c-4',
    category: 'c',
    title: 'Null byte character (\\0)',
    format: 'before%cafter',
    args: ['\0'],
    argsRepresentation: "'\\0'",
    description: 'Write 1 byte of \\0 without early termination',
  },

  // %s Cases
  {
    id: 's-1',
    category: 's',
    title: 'Standard string',
    format: '%s',
    args: ['Hello 42 School!'],
    argsRepresentation: '"Hello 42 School!"',
    description: 'Standard null-terminated string printing',
  },
  {
    id: 's-2',
    category: 's',
    title: 'Empty string',
    format: 'Empty: [%s]',
    args: [''],
    argsRepresentation: '""',
    description: 'Zero-length string behavior',
  },
  {
    id: 's-3',
    category: 's',
    title: 'NULL string pointer',
    format: 'Null pointer: %s',
    args: [null],
    argsRepresentation: 'NULL',
    description: 'Must print (null) and return 6 characters for the token',
  },
  {
    id: 's-4',
    category: 's',
    title: 'Multiple strings consecutive',
    format: '%s %s %s',
    args: ['42', 'is', 'awesome'],
    argsRepresentation: '"42", "is", "awesome"',
    description: 'Sequential string argument retrieval',
  },

  // %p Cases
  {
    id: 'p-1',
    category: 'p',
    title: 'Valid memory address',
    format: 'Pointer: %p',
    args: ['0x7ffee1b2c340'],
    argsRepresentation: '&variable',
    description: 'Hexadecimal address prefixed with 0x in lowercase',
  },
  {
    id: 'p-2',
    category: 'p',
    title: 'NULL pointer',
    format: 'Address: %p',
    args: [null],
    argsRepresentation: 'NULL / 0',
    description: 'Linux libc standard: prints (nil) (5 bytes)',
  },
  {
    id: 'p-3',
    category: 'p',
    title: 'Low address pointer',
    format: '%p',
    args: ['0x10'],
    argsRepresentation: '(void *)16',
    description: 'Small hexadecimal address formatting',
  },

  // %d & %i Cases
  {
    id: 'd-1',
    category: 'd_i',
    title: 'Zero value',
    format: 'Value: %d',
    args: [0],
    argsRepresentation: '0',
    description: 'Single zero digit printing',
  },
  {
    id: 'd-2',
    category: 'd_i',
    title: 'Positive integer',
    format: '%d',
    args: [42],
    argsRepresentation: '42',
    description: 'Standard positive number',
  },
  {
    id: 'd-3',
    category: 'd_i',
    title: 'Negative integer',
    format: '%i',
    args: [-42],
    argsRepresentation: '-42',
    description: 'Negative number with leading minus sign',
  },
  {
    id: 'd-4',
    category: 'd_i',
    title: 'INT_MAX limit',
    format: 'max: %d',
    args: [2147483647],
    argsRepresentation: 'INT_MAX (2147483647)',
    description: '32-bit signed maximum integer',
  },
  {
    id: 'd-5',
    category: 'd_i',
    title: 'INT_MIN limit (Tricky Edge Case)',
    format: 'min: %d',
    args: [-2147483648],
    argsRepresentation: 'INT_MIN (-2147483648)',
    description: 'Must handle -(-2147483648) without signed 32-bit overflow',
  },

  // %u Cases
  {
    id: 'u-1',
    category: 'u',
    title: 'Zero unsigned',
    format: '%u',
    args: [0],
    argsRepresentation: '0U',
    description: 'Unsigned 0',
  },
  {
    id: 'u-2',
    category: 'u',
    title: 'UINT_MAX boundary',
    format: 'UINT_MAX: %u',
    args: [4294967295],
    argsRepresentation: 'UINT_MAX (4294967295U)',
    description: 'Maximum 32-bit unsigned integer value',
  },
  {
    id: 'u-3',
    category: 'u',
    title: 'Negative cast into unsigned',
    format: '%u',
    args: [-1],
    argsRepresentation: '-1 (cast to unsigned)',
    description: '-1 casts to 4294967295 in unsigned format',
  },

  // %x & %X Cases
  {
    id: 'x-1',
    category: 'x_X',
    title: 'Zero in hex',
    format: 'hex: %x',
    args: [0],
    argsRepresentation: '0',
    description: 'Zero formatted as lowercase hex',
  },
  {
    id: 'x-2',
    category: 'x_X',
    title: 'Small number in hex',
    format: '%x',
    args: [255],
    argsRepresentation: '255',
    description: 'Prints "ff"',
  },
  {
    id: 'x-3',
    category: 'x_X',
    title: 'Uppercase Hex (%X)',
    format: '%X',
    args: [255],
    argsRepresentation: '255',
    description: 'Prints "FF" in uppercase',
  },
  {
    id: 'x-4',
    category: 'x_X',
    title: 'DEADBEEF in hex',
    format: 'low: %x, UP: %X',
    args: [3735928559, 3735928559],
    argsRepresentation: '3735928559, 3735928559',
    description: 'deadbeef vs DEADBEEF',
  },

  // %% Percent Cases
  {
    id: 'pct-1',
    category: 'percent',
    title: 'Single escaped percent',
    format: '%%',
    args: [],
    argsRepresentation: '(none)',
    description: 'Prints single "%" character and returns 1',
  },
  {
    id: 'pct-2',
    category: 'percent',
    title: 'Multiple consecutive percents',
    format: '%%%%',
    args: [],
    argsRepresentation: '(none)',
    description: 'Prints "%%" and returns 2',
  },
  {
    id: 'pct-3',
    category: 'percent',
    title: 'Percent in sentence',
    format: 'Battery at %d%% remaining',
    args: [95],
    argsRepresentation: '95',
    description: 'Mixed literal, specifier and escaped percent',
  },

  // Mixed Cases
  {
    id: 'mix-1',
    category: 'mixed',
    title: 'Full spectrum combination',
    format: 'User [%s] (id=%d) logged in with code 0x%x (100%% verified, ptr: %p)',
    args: ['Student', 42, 255, '0x7ffd98a100'],
    argsRepresentation: '"Student", 42, 255, &status',
    description: 'Chaining string, int, hex, percent, and pointer in a single call',
  },
  {
    id: 'mix-2',
    category: 'mixed',
    title: 'Extremes sequence',
    format: '%d -> %u -> %x -> %X -> %s',
    args: [-2147483648, 4294967295, 3735928559, 3735928559, 'DONE'],
    argsRepresentation: 'INT_MIN, UINT_MAX, 0xdeadbeef, 0xdeadbeef, "DONE"',
    description: 'Testing back-to-back numeric boundaries',
  },
];

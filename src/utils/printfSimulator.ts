export interface FormatStep {
  type: 'literal' | 'specifier';
  raw: string;
  specifier?: string;
  argValue?: any;
  printedChunk: string;
  bytesCount: number;
}

export interface SimulationResult {
  output: string;
  returnVal: number;
  steps: FormatStep[];
  hexDump: string[];
}

export function simulateFtPrintf(
  format: string,
  args: any[],
  options: { nilFormat: '(nil)' | '0x0' } = { nilFormat: '(nil)' }
): SimulationResult {
  let output = '';
  const steps: FormatStep[] = [];
  let argIdx = 0;
  let i = 0;

  while (i < format.length) {
    if (format[i] === '%' && i + 1 < format.length) {
      const spec = format[i + 1];
      let chunk = '';
      let argVal: any = undefined;

      if (spec === '%') {
        chunk = '%';
        steps.push({
          type: 'specifier',
          raw: '%%',
          specifier: '%',
          printedChunk: chunk,
          bytesCount: 1,
        });
      } else if (spec === 'c') {
        argVal = argIdx < args.length ? args[argIdx++] : '\0';
        if (typeof argVal === 'number') {
          chunk = String.fromCharCode(argVal & 0xff);
        } else if (typeof argVal === 'string' && argVal.length > 0) {
          chunk = argVal[0];
        } else {
          chunk = '\0';
        }
        steps.push({
          type: 'specifier',
          raw: '%c',
          specifier: 'c',
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: 1,
        });
      } else if (spec === 's') {
        argVal = argIdx < args.length ? args[argIdx++] : null;
        if (argVal === null || argVal === undefined) {
          chunk = '(null)';
        } else {
          chunk = String(argVal);
        }
        steps.push({
          type: 'specifier',
          raw: '%s',
          specifier: 's',
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: chunk.length,
        });
      } else if (spec === 'p') {
        argVal = argIdx < args.length ? args[argIdx++] : null;
        if (argVal === null || argVal === 0 || argVal === 'NULL' || argVal === undefined) {
          chunk = options.nilFormat;
        } else if (typeof argVal === 'number' || typeof argVal === 'bigint') {
          chunk = '0x' + BigInt(argVal).toString(16).toLowerCase();
        } else if (typeof argVal === 'string' && argVal.startsWith('0x')) {
          chunk = argVal.toLowerCase();
        } else {
          chunk = '0x' + (Number(argVal) || 0).toString(16).toLowerCase();
        }
        steps.push({
          type: 'specifier',
          raw: '%p',
          specifier: 'p',
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: chunk.length,
        });
      } else if (spec === 'd' || spec === 'i') {
        argVal = argIdx < args.length ? args[argIdx++] : 0;
        let num = parseInt(String(argVal), 10);
        if (isNaN(num)) num = 0;
        // 32-bit signed int behavior
        num = (num | 0);
        chunk = num.toString(10);
        steps.push({
          type: 'specifier',
          raw: `%${spec}`,
          specifier: spec,
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: chunk.length,
        });
      } else if (spec === 'u') {
        argVal = argIdx < args.length ? args[argIdx++] : 0;
        let num = parseInt(String(argVal), 10);
        if (isNaN(num)) num = 0;
        // 32-bit unsigned int behavior
        const uNum = (num >>> 0);
        chunk = uNum.toString(10);
        steps.push({
          type: 'specifier',
          raw: '%u',
          specifier: 'u',
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: chunk.length,
        });
      } else if (spec === 'x') {
        argVal = argIdx < args.length ? args[argIdx++] : 0;
        let num = parseInt(String(argVal), 10);
        if (isNaN(num)) num = 0;
        const uNum = (num >>> 0);
        chunk = uNum.toString(16).toLowerCase();
        steps.push({
          type: 'specifier',
          raw: '%x',
          specifier: 'x',
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: chunk.length,
        });
      } else if (spec === 'X') {
        argVal = argIdx < args.length ? args[argIdx++] : 0;
        let num = parseInt(String(argVal), 10);
        if (isNaN(num)) num = 0;
        const uNum = (num >>> 0);
        chunk = uNum.toString(16).toUpperCase();
        steps.push({
          type: 'specifier',
          raw: '%X',
          specifier: 'X',
          argValue: argVal,
          printedChunk: chunk,
          bytesCount: chunk.length,
        });
      } else {
        // Unknown or trailing %
        chunk = '%' + spec;
        steps.push({
          type: 'literal',
          raw: '%' + spec,
          printedChunk: chunk,
          bytesCount: 2,
        });
      }

      output += chunk;
      i += 2;
    } else {
      const char = format[i];
      output += char;
      steps.push({
        type: 'literal',
        raw: char,
        printedChunk: char,
        bytesCount: 1,
      });
      i++;
    }
  }

  // Generate hex dump
  const hexDump: string[] = [];
  for (let j = 0; j < output.length; j++) {
    const code = output.charCodeAt(j);
    hexDump.push(code.toString(16).padStart(2, '0').toUpperCase());
  }

  return {
    output,
    returnVal: output.length,
    steps,
    hexDump,
  };
}

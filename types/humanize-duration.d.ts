declare module 'humanize-duration' {
  interface HumanizerOptions {
    language?: string;
    languages?: Record<string, any>;
    fallbacks?: string[];
    delimiter?: string;
    spacer?: string;
    largest?: number;
    round?: boolean;
    units?: string[];
    serialComma?: boolean;
    conjunction?: string;
    decimal?: string;
    maxDecimalPoints?: number;
    unitMeasures?: Record<string, number>;
  }

  function humanizer(ms: number, options?: HumanizerOptions): string;

  namespace humanizer {
    function humanizer(options?: HumanizerOptions): (ms: number) => string;
  }

  export = humanizer;
}

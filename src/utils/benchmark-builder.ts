import _ from 'lodash';

export interface BenchmarkSuite {
  title: string;
  data: number[];
}

export interface BenchmarkResult {
  position: number;
  title: string;
  mean: string;
  variance: string;
  size: number;
}

export function computeAverage(data: number[]): number {
  if (data.length === 0) {
    return 0;
  }

  return _.sum(data) / data.length;
}

export function computeVariance(data: number[]): number {
  const mean = computeAverage(data);
  const squaredDiffs = data.map(value => Math.pow(value - mean, 2));
  return computeAverage(squaredDiffs);
}

export function arrayToMarkdownTable({
  data,
  headerMap = {}
}: {
  data: Record<string, unknown>[];
  headerMap?: Record<string, string>;
}): string {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(obj => Object.values(obj));

  const headerRow = `| ${headers.map(header => headerMap[header] ?? header).join(' | ')} |`;
  const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

export function generateBenchmarkResults(
  suites: BenchmarkSuite[],
  unit: string = ''
): BenchmarkResult[] {
  const round = (v: number) => Math.round(v * 1000) / 1000;

  return suites
    .map(({ data: dirtyData, title }) => {
      const data = dirtyData.filter(_.isNumber);

      return {
        title,
        size: data.length,
        mean: computeAverage(data),
        variance: computeVariance(data),
      };
    })
    .sort((a, b) => a.mean - b.mean)
    .map(({ mean, variance, size, title }, index, suites) => {
      const cleanUnit = unit.trim();
      const bestMean: number = suites[0].mean;
      const deltaWithBestMean = mean - bestMean;
      const ratioWithBestMean = bestMean === 0 ? '∞' : round(mean / bestMean);

      const comparisonValues: string =
        index !== 0 && bestMean !== mean
          ? ` (+${round(deltaWithBestMean)}${cleanUnit} ; x${ratioWithBestMean})`
          : '';

      return {
        position: index + 1,
        title,
        mean: `${round(mean)}${cleanUnit}${comparisonValues}`,
        variance: `${round(variance)}${cleanUnit}${cleanUnit ? '²' : ''}`,
        size,
      };
    });
}

export function generateBulletList(
  results: BenchmarkResult[],
  headerMap: Record<string, string>
): string {
  return results
    .flatMap(({ title, ...sections }) => {
      return [
        ` - ${title}`,
        ...Object.entries(sections).map(
          ([key, value]) => `    - ${headerMap[key as keyof typeof headerMap] ?? key}: ${value}`
        ),
      ];
    })
    .join('\n');
}
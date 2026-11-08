// Take-home pay for a permanent employee in Indonesia, month by month and in December.
// Sources: PP 58/2023 + PMK 168/2023 (PPh 21 TER and the December re-count), UU 7/2021
// (Pasal 17 rates), Perpres 64/2020 (BPJS Kesehatan), PP 44/45/46 2015 (BPJS Ketenagakerjaan).
// Check these each year, mainly JP_CAP.

// shortcut: BPJS is counted on the salary even below the regional minimum wage (UMK), where
// BPJS Kesehatan really uses the UMK; that needs every region's UMK, and such pay is rare
export const RATES_AS_OF = new Date('2026-03-01');
// the JP cap moves every March; past this date the page warns and the test fails until it's updated
export const RATES_EXPIRE = new Date('2027-03-01');

// raised every March by BPJS Ketenagakerjaan (letter B/1226/022026 for 2026)
export const JP_CAP = 11_086_300;
export const KES_CAP = 12_000_000;
// basis points, so the math stays in whole numbers
const JKM = 30;
// JKK by how risky the work is, set per business sector; offices are the lowest
// (very low to very high; the page names them)
export const JKK_RATES = [24, 54, 89, 127, 174] as const;

export const PTKP_STATUSES = [
  'TK/0',
  'TK/1',
  'TK/2',
  'TK/3',
  'K/0',
  'K/1',
  'K/2',
  'K/3',
] as const;
export type PtkpStatus = (typeof PTKP_STATUSES)[number];

// [monthly gross up to, rate %], from the PP 58/2023 annex
type Ter = [number, number][];
// prettier-ignore
const TER_A: Ter = [
  [5_400_000, 0], [5_650_000, 0.25], [5_950_000, 0.5], [6_300_000, 0.75],
  [6_750_000, 1], [7_500_000, 1.25], [8_550_000, 1.5], [9_650_000, 1.75],
  [10_050_000, 2], [10_350_000, 2.25], [10_700_000, 2.5], [11_050_000, 3],
  [11_600_000, 3.5], [12_500_000, 4], [13_750_000, 5], [15_100_000, 6],
  [16_950_000, 7], [19_750_000, 8], [24_150_000, 9], [26_450_000, 10],
  [28_000_000, 11], [30_050_000, 12], [32_400_000, 13], [35_400_000, 14],
  [39_100_000, 15], [43_850_000, 16], [47_800_000, 17], [51_400_000, 18],
  [56_300_000, 19], [62_200_000, 20], [68_600_000, 21], [77_500_000, 22],
  [89_000_000, 23], [103_000_000, 24], [125_000_000, 25], [157_000_000, 26],
  [206_000_000, 27], [337_000_000, 28], [454_000_000, 29], [550_000_000, 30],
  [695_000_000, 31], [910_000_000, 32], [1_400_000_000, 33], [Infinity, 34],
];
// prettier-ignore
const TER_B: Ter = [
  [6_200_000, 0], [6_500_000, 0.25], [6_850_000, 0.5], [7_300_000, 0.75],
  [9_200_000, 1], [10_750_000, 1.5], [11_250_000, 2], [11_600_000, 2.5],
  [12_600_000, 3], [13_600_000, 4], [14_950_000, 5], [16_400_000, 6],
  [18_450_000, 7], [21_850_000, 8], [26_000_000, 9], [27_700_000, 10],
  [29_350_000, 11], [31_450_000, 12], [33_950_000, 13], [37_100_000, 14],
  [41_100_000, 15], [45_800_000, 16], [49_500_000, 17], [53_800_000, 18],
  [58_500_000, 19], [64_000_000, 20], [71_000_000, 21], [80_000_000, 22],
  [93_000_000, 23], [109_000_000, 24], [129_000_000, 25], [163_000_000, 26],
  [211_000_000, 27], [374_000_000, 28], [459_000_000, 29], [555_000_000, 30],
  [704_000_000, 31], [957_000_000, 32], [1_405_000_000, 33], [Infinity, 34],
];
// prettier-ignore
const TER_C: Ter = [
  [6_600_000, 0], [6_950_000, 0.25], [7_350_000, 0.5], [7_800_000, 0.75],
  [8_850_000, 1], [9_800_000, 1.25], [10_950_000, 1.5], [11_200_000, 1.75],
  [12_050_000, 2], [12_950_000, 3], [14_150_000, 4], [15_550_000, 5],
  [17_050_000, 6], [19_500_000, 7], [22_700_000, 8], [26_600_000, 9],
  [28_100_000, 10], [30_100_000, 11], [32_600_000, 12], [35_400_000, 13],
  [38_900_000, 14], [43_000_000, 15], [47_400_000, 16], [51_200_000, 17],
  [55_800_000, 18], [60_400_000, 19], [66_700_000, 20], [74_500_000, 21],
  [83_200_000, 22], [95_600_000, 23], [110_000_000, 24], [134_000_000, 25],
  [169_000_000, 26], [221_000_000, 27], [390_000_000, 28], [463_000_000, 29],
  [561_000_000, 30], [709_000_000, 31], [965_000_000, 32], [1_419_000_000, 33],
  [Infinity, 34],
];

const terFor = (status: PtkpStatus): Ter =>
  ['TK/0', 'TK/1', 'K/0'].includes(status)
    ? TER_A
    : status === 'K/3'
      ? TER_C
      : TER_B;

// a year's tax-free allowance: Rp54M for yourself, Rp4.5M more for being married and per dependent
const ptkp = (status: PtkpStatus) =>
  54_000_000 +
  4_500_000 * (Number(status.startsWith('K/')) + Number(status.slice(-1)));

// [yearly taxable income up to, rate %], Pasal 17 as UU HPP set it
const PASAL_17: [number, number][] = [
  [60_000_000, 5],
  [250_000_000, 15],
  [500_000_000, 25],
  [5_000_000_000, 30],
  [Infinity, 35],
];

// [lump sum up to, rate %], final tax on severance by PP 68/2009, which PP 58/2023 kept
const SEVERANCE: [number, number][] = [
  [50_000_000, 0],
  [100_000_000, 5],
  [500_000_000, 15],
  [Infinity, 25],
];

// each slice of the amount taxed at its own bracket's rate
const tiered = (amount: number, brackets: [number, number][]) => {
  let tax = 0;
  let from = 0;
  for (const [upTo, rate] of brackets) {
    tax += pct(Math.max(0, Math.min(amount, upTo) - from), rate * 100);
    from = upTo;
  }
  return tax;
};

// whole rupiah, rounded down like payroll does; bps keeps 10M × 0.24% from landing on 23,999.99…
const pct = (base: number, bps: number) => Math.floor((base * bps) / 10_000);

type Extras = {
  // JKK rate in basis points
  jkk?: number;
  // one-off pay this month (bonus, THR, overtime): taxed, but no BPJS on it
  bonus?: number;
};

export const takeHomePay = (
  salary: number,
  status: PtkpStatus,
  { jkk = 24, bonus = 0 }: Extras = {}
) => {
  const kesBase = Math.min(salary, KES_CAP);
  // what the employer pays for you; JKK, JKM and BPJS Kesehatan count as taxable income
  const employer = {
    jkk: pct(salary, jkk),
    jkm: pct(salary, JKM),
    kesehatan: pct(kesBase, 400),
  };
  const taxable =
    salary + bonus + employer.jkk + employer.jkm + employer.kesehatan;
  const [, rate] = terFor(status).find(([upTo]) => taxable <= upTo)!;
  const deductions = {
    jht: pct(salary, 200),
    jp: pct(Math.min(salary, JP_CAP), 100),
    kesehatan: pct(kesBase, 100),
    pph21: pct(taxable, rate * 100),
  };
  const net =
    salary +
    bonus -
    deductions.jht -
    deductions.jp -
    deductions.kesehatan -
    deductions.pph21;
  return { taxable, rate, employer, deductions, net };
};

// Works a take-home amount back to the gross that pays exactly that, preferring a round
// thousand like offer letters use. Take-home doesn't always rise with gross (crossing into a
// higher TER bracket can cost more than the raise), so some amounts can't be hit exactly;
// then it's the lowest round thousand that pays more, and the page says so.
export const grossFor = (net: number, status: PtkpStatus, jkk?: number) => {
  const pays = (gross: number) => takeHomePay(gross, status, { jkk }).net;
  // gross is never below take-home, and deductions never reach half of it
  let lo = Math.ceil(net / 1000);
  let hi = Math.ceil((net * 2) / 1000);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (pays(mid * 1000) >= net) hi = mid;
    else lo = mid + 1;
  }
  const round = lo * 1000;
  if (pays(round) === net) return round;
  // scanned, not bisected: each deduction rounds down, so take-home wobbles by a rupiah or two
  for (let gross = Math.max(0, round - 999); gross < round; gross++)
    if (pays(gross) === net) return gross;
  return round;
};

// December re-counts the whole year's tax with the Pasal 17 rates and takes what Jan–Nov
// didn't (TER is only an estimate), so December pay differs. Assumes a full year at this
// salary, with the bonus, if any, paid once in Jan–Nov.
export const december = (
  salary: number,
  status: PtkpStatus,
  { jkk, bonus = 0 }: Extras = {}
) => {
  const month = takeHomePay(salary, status, { jkk });
  const bonusMonth = takeHomePay(salary, status, { jkk, bonus });
  const yearly = 12 * month.taxable + bonus;
  // biaya jabatan, 5% capped at Rp6M a year, and your own JHT and JP are deducted first
  const jobCost = Math.min(pct(yearly, 500), 6_000_000);
  const pension = 12 * (month.deductions.jht + month.deductions.jp);
  // the taxed amount is rounded down to whole thousands
  const taxed =
    Math.floor(Math.max(0, yearly - jobCost - pension - ptkp(status)) / 1000) *
    1000;
  const yearTax = tiered(taxed, PASAL_17);
  const withheld = 10 * month.deductions.pph21 + bonusMonth.deductions.pph21;
  // below zero when Jan–Nov took too much: the employer pays it back in December
  const pph21 = yearTax - withheld;
  const net =
    salary -
    month.deductions.jht -
    month.deductions.jp -
    month.deductions.kesehatan -
    pph21;
  return { yearTax, withheld, pph21, net };
};

// What a contract (PKWT) pays when it ends: months ÷ 12 of a month's salary (PP 35/2021).
// No tax rule names it, so employers either tax it as severance (final, usually nothing under
// Rp50M) or add it to the year's pay like a bonus; both are returned for the page to show.
export const compensation = (
  salary: number,
  months: number,
  status: PtkpStatus,
  { jkk, bonus = 0 }: Extras = {}
) => {
  const amount = Math.floor((salary * months) / 12);
  const yearTax = (extra: number) =>
    december(salary, status, { jkk, bonus: bonus + extra }).yearTax;
  return {
    amount,
    asSeverance: tiered(amount, SEVERANCE),
    // what it adds to the year's tax, which December settles
    withPay: yearTax(amount) - yearTax(0),
  };
};

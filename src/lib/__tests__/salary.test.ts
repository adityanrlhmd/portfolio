import {
  PTKP_STATUSES,
  RATES_EXPIRE,
  compensation,
  december,
  grossFor,
  takeHomePay,
} from '../salary';

it('has rates from the last year (update JP_CAP, RATES_AS_OF and RATES_EXPIRE)', () => {
  expect(Date.now()).toBeLessThan(RATES_EXPIRE.getTime());
});

describe('takeHomePay', () => {
  it('counts BPJS and TER category A for a single person', () => {
    const pay = takeHomePay(10_000_000, 'TK/0');
    // 10M + JKK 24k + JKM 30k + Kesehatan 400k, in the 2.5% bracket
    expect(pay.taxable).toBe(10_454_000);
    expect(pay.rate).toBe(2.5);
    expect(pay.deductions).toEqual({
      jht: 200_000,
      jp: 100_000,
      kesehatan: 100_000,
      pph21: 261_350,
    });
    expect(pay.net).toBe(9_338_650);
  });

  it('caps JP and Kesehatan and uses category B for K/1', () => {
    const pay = takeHomePay(20_000_000, 'K/1');
    expect(pay.taxable).toBe(20_588_000);
    expect(pay.rate).toBe(8);
    expect(pay.deductions.jp).toBe(110_863);
    expect(pay.deductions.kesehatan).toBe(120_000);
    expect(pay.net).toBe(17_722_097);
  });

  it('uses category C only for K/3', () => {
    // 7M + 317.8k sits in A's 1.25%, B's 1% and C's 0.5% bracket
    expect(takeHomePay(7_000_000, 'TK/1').rate).toBe(1.25);
    expect(takeHomePay(7_000_000, 'K/2').rate).toBe(1);
    expect(takeHomePay(7_000_000, 'K/3').rate).toBe(0.5);
  });

  it('takes no tax under the lowest bracket and tops out at 34%', () => {
    expect(takeHomePay(5_000_000, 'TK/0').deductions.pph21).toBe(0);
    expect(takeHomePay(2_000_000_000, 'K/3').rate).toBe(34);
  });
});

describe('grossFor', () => {
  it('prefers a round gross, else the exact rupiah', () => {
    expect(grossFor(9_338_650, 'TK/0')).toBe(10_000_000);
    expect(grossFor(17_722_097, 'K/1')).toBe(20_000_000);
    expect(grossFor(15_000_000, 'TK/0')).toBe(16_973_994);
    expect(grossFor(0, 'TK/0')).toBe(0);
  });

  it('hits the take-home exactly, or else pays a little more from the lowest round thousand', () => {
    let exact = 0;
    let total = 0;
    for (const status of PTKP_STATUSES)
      for (
        let net = 1_000_000;
        net < 300_000_000;
        net = Math.ceil(net * 1.13)
      ) {
        const gross = grossFor(net, status);
        const paid = takeHomePay(gross, status).net;
        total++;
        if (paid === net) exact++;
        else {
          expect(paid).toBeGreaterThan(net);
          expect(gross % 1000).toBe(0);
          expect(takeHomePay(gross - 1000, status).net).toBeLessThan(net);
        }
      }
    // misses only happen on a TER bracket edge
    expect(exact / total).toBeGreaterThan(0.9);
  });
});

describe('extras', () => {
  it('uses the chosen JKK rate in the taxed amount', () => {
    // 10M at 1.74%: JKK 174k instead of 24k
    expect(takeHomePay(10_000_000, 'TK/0', { jkk: 174 }).taxable).toBe(
      10_604_000
    );
  });

  it('taxes a bonus without BPJS on it', () => {
    const pay = takeHomePay(10_000_000, 'TK/0', { bonus: 10_000_000 });
    expect(pay.rate).toBe(9);
    expect(pay.deductions.jht).toBe(200_000);
    expect(pay.deductions.pph21).toBe(1_840_860);
    expect(pay.net).toBe(17_759_140);
  });
});

describe('december', () => {
  it('re-counts the year with Pasal 17 and takes what Jan–Nov left', () => {
    // a year of 10,454,000 taxed, less Rp6M job cost, Rp3.6M JHT+JP and Rp54M PTKP
    // leaves 61,848,000: 5% of 60M + 15% of the rest
    const dec = december(10_000_000, 'TK/0');
    expect(dec.yearTax).toBe(3_277_200);
    expect(dec.withheld).toBe(11 * 261_350);
    expect(dec.pph21).toBe(402_350);
    expect(dec.net).toBe(9_197_650);
  });

  it('counts the bonus month in what was withheld', () => {
    const dec = december(10_000_000, 'TK/0', { bonus: 10_000_000 });
    expect(dec.withheld).toBe(10 * 261_350 + 1_840_860);
    expect(dec.yearTax).toBe(4_777_200);
    expect(dec.pph21).toBe(322_840);
  });

  it('pays back what a big bonus month over-withheld', () => {
    const dec = december(10_000_000, 'TK/0', { bonus: 50_000_000 });
    expect(dec.pph21).toBe(-3_927_100);
    expect(dec.net).toBe(10_000_000 - 400_000 + 3_927_100);
  });

  it('takes no tax under PTKP', () => {
    expect(december(4_000_000, 'K/3').yearTax).toBe(0);
  });
});

describe('compensation', () => {
  it('pays months ÷ 12 of a salary, taxed either way', () => {
    const comp = compensation(10_000_000, 12, 'TK/0');
    expect(comp.amount).toBe(10_000_000);
    // under Rp50M, severance tax is nothing
    expect(comp.asSeverance).toBe(0);
    // with pay, it lands in the year's 15% bracket
    expect(comp.withPay).toBe(1_500_000);
    expect(compensation(10_000_000, 6, 'TK/0').amount).toBe(5_000_000);
  });

  it('taxes severance by its own brackets', () => {
    // 60M: nothing on the first 50M, 5% of the next 10M
    expect(compensation(60_000_000, 12, 'TK/0').asSeverance).toBe(500_000);
  });
});

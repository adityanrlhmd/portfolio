import { RiInformationLine } from '@remixicon/react';

import { useState } from 'react';

import { ToolLayout } from '@/components/tool-layout';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import {
  JKK_RATES,
  JP_CAP,
  KES_CAP,
  PTKP_STATUSES,
  type PtkpStatus,
  RATES_AS_OF,
  RATES_EXPIRE,
  compensation,
  december,
  grossFor,
  takeHomePay,
} from '@/lib/salary';
import { cn } from '@/lib/utils';

// checked once when the page loads, which is often enough for a yearly date
const OUTDATED = Date.now() >= RATES_EXPIRE.getTime();

const rupiah = (value: number) => `Rp${value.toLocaleString('id-ID')}`;
const percent = (bps: number) => `${(bps / 100).toLocaleString('id-ID')}%`;

// rupiah with dots while typing; anything that isn't a digit is dropped
const RupiahInput = ({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
}) => (
  <Input
    id={id}
    inputMode="numeric"
    placeholder={placeholder}
    value={value ? value.toLocaleString('id-ID') : ''}
    onChange={e => onChange(Number(e.target.value.replace(/\D/g, '')))}
  />
);

// one of a few choices, pressed like the mobile Edit/Preview tabs
const Toggle = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (value: T) => void;
}) => (
  <div role="group" aria-label={label} className="flex gap-2">
    {(Object.keys(options) as T[]).map(key => (
      <Button
        key={key}
        type="button"
        variant={value === key ? 'secondary' : 'ghost'}
        aria-pressed={value === key}
        onClick={() => onChange(key)}
      >
        {options[key]}
      </Button>
    ))}
  </div>
);

// for the few lines that change how to read a number; calm on purpose, since red or yellow
// reads as an error, and the red is kept for out-of-date rates
const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="bg-muted/50 flex gap-2 rounded-md border p-2.5 text-xs/relaxed">
    <RiInformationLine className="text-primary mt-0.5 size-3.5 shrink-0" />
    <span>{children}</span>
  </p>
);

const SELECT =
  'focus-visible:border-ring focus-visible:ring-ring/30 bg-background h-9 w-full rounded-md border px-2 text-sm outline-none focus-visible:ring-2 md:text-xs/relaxed';

const Row = ({
  label,
  value,
  minus,
  strong,
}: {
  label: string;
  value: number;
  minus?: boolean;
  strong?: boolean;
}) => (
  <div
    className={cn(
      'flex justify-between gap-4 py-1.5',
      strong && 'border-t pt-3 font-bold'
    )}
  >
    <dt className={cn(!strong && 'text-muted-foreground')}>{label}</dt>
    <dd className="tabular-nums">
      {minus && value > 0 && '−'}
      {rupiah(value)}
    </dd>
  </div>
);

// offers in Indonesia quote either one, so the amount can be either
const KNOWN = {
  gross: {
    label: 'Gross',
    field: 'Monthly gross salary',
    hint: 'Base pay plus fixed allowances, in rupiah, before anything is taken out.',
  },
  net: {
    label: 'Take-home',
    field: 'Monthly take-home pay',
    hint: 'What lands in your account (THP), in rupiah. The gross is worked out from it.',
  },
};

// every short form the page uses, for people who haven't had a payslip in Indonesia yet
const TERMS = [
  ['THP', 'Take-home pay', 'What lands in your account each month.'],
  [
    'THR',
    'Tunjangan Hari Raya',
    'The holiday bonus, usually a month of salary, paid before Lebaran or your own religious holiday.',
  ],
  [
    'PTKP',
    'Penghasilan Tidak Kena Pajak',
    'Your tax-free allowance. TK is single (tidak kawin), K is married (kawin), and the number is how many dependents you claim.',
  ],
  [
    'PPh 21',
    'Pajak Penghasilan Pasal 21',
    'Income tax your employer takes from your pay and pays for you.',
  ],
  [
    'TER',
    'Tarif Efektif Rata-rata',
    'The monthly PPh 21 rate, set by your gross and PTKP status.',
  ],
  [
    'Pasal 17',
    '',
    'The yearly income tax rates, 5% to 35%, that December uses to settle the whole year.',
  ],
  [
    'JHT',
    'Jaminan Hari Tua',
    'Savings at BPJS Ketenagakerjaan, paid out when you stop working or retire.',
  ],
  [
    'JP',
    'Jaminan Pensiun',
    'A monthly pension from BPJS Ketenagakerjaan once you retire.',
  ],
  ['BPJS Kesehatan', '', 'National health insurance, for you and your family.'],
  [
    'JKK',
    'Jaminan Kecelakaan Kerja',
    'Work accident insurance, paid by your employer.',
  ],
  [
    'JKM',
    'Jaminan Kematian',
    'Death benefit for your family, paid by your employer.',
  ],
  [
    'PKWT',
    'Perjanjian Kerja Waktu Tertentu',
    'A fixed-term contract job. Taxed like a permanent one each month, plus compensation when the contract ends.',
  ],
] as const;

const SalaryPage = () => {
  const [known, setKnown] = useState<keyof typeof KNOWN>('gross');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState<PtkpStatus>('TK/0');
  const [bonus, setBonus] = useState(0);
  const [jkk, setJkk] = useState<number>(JKK_RATES[0].bps);
  const [job, setJob] = useState<'permanent' | 'contract'>('permanent');
  const [months, setMonths] = useState(12);
  const salary = known === 'gross' ? amount : grossFor(amount, status, jkk);
  const pay = takeHomePay(salary, status, { jkk });
  const bonusMonth = takeHomePay(salary, status, { jkk, bonus });
  const dec = december(salary, status, { jkk, bonus });
  const comp = compensation(salary, months, status, { jkk, bonus });

  return (
    <ToolLayout
      actions={null}
      tabs={['Salary', 'Breakdown']}
      form={
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="salary">{KNOWN[known].field}</FieldLabel>
            <Toggle
              label="The amount is"
              value={known}
              options={{ gross: KNOWN.gross.label, net: KNOWN.net.label }}
              onChange={setKnown}
            />
            <RupiahInput
              id="salary"
              value={amount}
              onChange={setAmount}
              placeholder="10.000.000"
            />
            <FieldDescription>{KNOWN[known].hint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="status">Tax status (PTKP)</FieldLabel>
            <select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as PtkpStatus)}
              className={SELECT}
            >
              {PTKP_STATUSES.map(value => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <FieldDescription>
              TK is single, K is married, and the number is how many dependents
              you claim, up to 3.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Employment</FieldLabel>
            <Toggle
              label="Employment"
              value={job}
              options={{ permanent: 'Permanent', contract: 'Contract (PKWT)' }}
              onChange={setJob}
            />
            {job === 'contract' && (
              <>
                <FieldLabel htmlFor="months" className="pt-2">
                  Contract length (months)
                </FieldLabel>
                <Input
                  id="months"
                  type="number"
                  min={1}
                  placeholder="12"
                  value={months || ''}
                  onChange={e => setMonths(Number(e.target.value))}
                />
                <FieldDescription>
                  How many months the contract runs. Each month is taxed the
                  same as a permanent job; the end brings compensation.
                </FieldDescription>
              </>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="bonus">
              Bonus, THR or overtime (optional)
            </FieldLabel>
            <RupiahInput
              id="bonus"
              value={bonus}
              onChange={setBonus}
              placeholder="0"
            />
            <FieldDescription>
              Paid once this year on top of the salary. It's taxed in the month
              it's paid, with no BPJS on it.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="jkk">Work risk (JKK)</FieldLabel>
            <select
              id="jkk"
              value={jkk}
              onChange={e => setJkk(Number(e.target.value))}
              className={SELECT}
            >
              {JKK_RATES.map(rate => (
                <option key={rate.bps} value={rate.bps}>
                  {rate.label}, {percent(rate.bps)}
                </option>
              ))}
            </select>
            <FieldDescription>
              Set by your employer's line of business. Most office jobs are very
              low.
            </FieldDescription>
          </Field>
          <section className="space-y-3 border-t pt-6">
            <h2 className="text-sm font-medium">What the terms mean</h2>
            <dl className="space-y-3 text-xs/relaxed">
              {TERMS.map(([term, name, meaning]) => (
                <div key={term}>
                  <dt className="font-medium">
                    {term}
                    {name && (
                      <span className="text-muted-foreground font-normal">
                        {' '}
                        ({name})
                      </span>
                    )}
                  </dt>
                  <dd className="text-muted-foreground">{meaning}</dd>
                </div>
              ))}
            </dl>
          </section>
        </form>
      }
      preview={
        <div className="flex max-h-full flex-col gap-2">
          <div
            role="region"
            aria-label="Take-home pay"
            className="min-h-0 space-y-6 overflow-y-auto rounded-md border p-4 text-sm"
          >
            {known === 'net' && pay.net !== amount && (
              <Note>
                No gross pays exactly {rupiah(amount)}, it sits on a tax bracket
                edge. This is the closest one that pays more.
              </Note>
            )}
            <section className="space-y-2">
              <h2 className="font-medium">Every month, January to November</h2>
              <dl>
                <Row label="Gross salary" value={salary} />
                <Row label="JHT (2%)" value={pay.deductions.jht} minus />
                <Row label="JP (1%)" value={pay.deductions.jp} minus />
                <Row
                  label="BPJS Kesehatan (1%)"
                  value={pay.deductions.kesehatan}
                  minus
                />
                <Row
                  label={`PPh 21 (${pay.rate.toLocaleString('id-ID')}% TER)`}
                  value={pay.deductions.pph21}
                  minus
                />
                <Row label="Take-home pay" value={pay.net} strong />
              </dl>
            </section>
            {bonus > 0 && (
              <section className="space-y-2">
                <h2 className="font-medium">The month with your bonus</h2>
                <p className="text-muted-foreground text-xs">
                  The bonus is added to that month's pay, so the TER rate goes
                  up for the month.
                </p>
                <dl>
                  <Row label="Bonus" value={bonus} />
                  <Row
                    label={`PPh 21 (${bonusMonth.rate.toLocaleString('id-ID')}% TER)`}
                    value={bonusMonth.deductions.pph21}
                    minus
                  />
                  <Row
                    label="Take-home that month"
                    value={bonusMonth.net}
                    strong
                  />
                </dl>
              </section>
            )}
            <section className="space-y-2">
              <h2 className="font-medium">December</h2>
              <p className="text-muted-foreground text-xs">
                The year's tax is re-counted with the Pasal 17 rates:{' '}
                {rupiah(dec.yearTax)}, of which {rupiah(dec.withheld)} was
                already taken January to November. December{' '}
                {dec.pph21 < 0 ? 'pays back the extra' : 'takes the rest'}.
              </p>
              <dl>
                {dec.pph21 < 0 ? (
                  <Row label="PPh 21 paid back" value={-dec.pph21} />
                ) : (
                  <Row label="PPh 21" value={dec.pph21} minus />
                )}
                <Row label="Take-home in December" value={dec.net} strong />
              </dl>
              {known === 'net' && amount > 0 && dec.net !== pay.net && (
                <Note>
                  If your offer fixes the take-home (PPh ditanggung perusahaan
                  or gross-up), December stays at {rupiah(pay.net)} and your
                  employer settles the tax difference, whichever way it goes.
                </Note>
              )}
            </section>
            {job === 'contract' && (
              <section className="space-y-2">
                <h2 className="font-medium">When the contract ends</h2>
                <p className="text-muted-foreground text-xs">
                  Compensation of {months} months ÷ 12 of your salary (PP
                  35/2021).
                </p>
                <Note>
                  No tax rule names it, so employers tax it one of the two ways
                  below. Ask HR which.
                </Note>
                <dl>
                  <Row label="Compensation" value={comp.amount} />
                  <Row
                    label="Tax as severance (final)"
                    value={comp.asSeverance}
                    minus
                  />
                  <Row
                    label="Or tax added to your pay"
                    value={comp.withPay}
                    minus
                  />
                </dl>
              </section>
            )}
            <section className="space-y-2">
              <h2 className="font-medium">Paid by your employer</h2>
              <p className="text-muted-foreground text-xs">
                Not in your pay, but JKK, JKM and BPJS Kesehatan count toward
                the {rupiah(pay.taxable)} the tax is worked out on.
              </p>
              <dl>
                <Row label={`JKK (${percent(jkk)})`} value={pay.employer.jkk} />
                <Row label="JKM (0,3%)" value={pay.employer.jkm} />
                <Row
                  label="BPJS Kesehatan (4%)"
                  value={pay.employer.kesehatan}
                />
              </dl>
            </section>
          </div>
          {OUTDATED && (
            <p role="alert" className="text-destructive text-xs">
              These rates are from {RATES_AS_OF} and may be out of date.
            </p>
          )}
          <FieldDescription>
            For a whole year at this salary. A contract that ends mid-year
            settles the year's tax in its last month instead of December. Rates
            as of {RATES_AS_OF}. JP is capped at a salary of {rupiah(JP_CAP)}{' '}
            and BPJS Kesehatan at {rupiah(KES_CAP)}.
          </FieldDescription>
        </div>
      }
    />
  );
};

export default SalaryPage;

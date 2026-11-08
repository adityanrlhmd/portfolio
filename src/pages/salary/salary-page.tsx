import { RiArrowDownSLine, RiInformationLine } from '@remixicon/react';

import { useState } from 'react';

import { useLang } from '@/components/language-provider';
import { Toggle } from '@/components/toggle';
import { ToolLayout } from '@/components/tool-layout';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { LOCALES, translations } from '@/lib/i18n';
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

// for the few lines that change how to read a number; calm on purpose, since red or yellow
// reads as an error, and the red is kept for out-of-date rates
const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="bg-muted/50 flex gap-2 rounded-md border p-2.5 text-xs/relaxed">
    <RiInformationLine className="text-primary mt-0.5 size-3.5 shrink-0" />
    <span>{children}</span>
  </p>
);

// native, so phones get their own picker, but with our chevron: the browser's sits flush to the edge
const Select = (props: React.ComponentProps<'select'>) => (
  <div className="relative">
    <select
      {...props}
      className="focus-visible:border-ring focus-visible:ring-ring/30 bg-background h-9 w-full appearance-none rounded-md border pr-8 pl-2.5 text-sm outline-none focus-visible:ring-2 md:text-xs/relaxed"
    />
    <RiArrowDownSLine
      aria-hidden
      className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2"
    />
  </div>
);

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

// every short form the page uses, with its full name; what each means is in T.terms
const TERMS = [
  ['THP', 'Take-home pay'],
  ['THR', 'Tunjangan Hari Raya'],
  ['PTKP', 'Penghasilan Tidak Kena Pajak'],
  ['PPh 21', 'Pajak Penghasilan Pasal 21'],
  ['TER', 'Tarif Efektif Rata-rata'],
  ['Pasal 17', ''],
  ['JHT', 'Jaminan Hari Tua'],
  ['JP', 'Jaminan Pensiun'],
  ['BPJS Kesehatan', ''],
  ['JKK', 'Jaminan Kecelakaan Kerja'],
  ['JKM', 'Jaminan Kematian'],
  ['PKWT', 'Perjanjian Kerja Waktu Tertentu'],
] as const;

const T = translations(
  {
    tabs: ['Salary', 'Breakdown'] as [string, string],
    // offers in Indonesia quote either one, so the amount can be either
    known: {
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
    },
    amountIs: 'The amount is',
    status: 'Tax status (PTKP)',
    statusHint:
      'TK is single, K is married, and the number is how many dependents you claim, up to 3.',
    employment: 'Employment',
    jobs: { permanent: 'Permanent', contract: 'Contract (PKWT)' },
    months: 'Contract length (months)',
    monthsHint:
      'How many months the contract runs. Each month is taxed the same as a permanent job; the end brings compensation.',
    bonus: 'Bonus, THR or overtime (optional)',
    bonusHint:
      "Paid once this year on top of the salary. It's taxed in the month it's paid, with no BPJS on it.",
    jkk: 'Work risk (JKK)',
    jkkLevels: ['Very low (offices)', 'Low', 'Medium', 'High', 'Very high'],
    jkkHint:
      "Set by your employer's line of business. Most office jobs are very low.",
    termsTitle: 'What the terms mean',
    terms: {
      THP: 'What lands in your account each month.',
      THR: 'The holiday bonus, usually a month of salary, paid before Lebaran or your own religious holiday.',
      PTKP: 'Your tax-free allowance. TK is single (tidak kawin), K is married (kawin), and the number is how many dependents you claim.',
      'PPh 21':
        'Income tax your employer takes from your pay and pays for you.',
      TER: 'The monthly PPh 21 rate, set by your gross and PTKP status.',
      'Pasal 17':
        'The yearly income tax rates, 5% to 35%, that December uses to settle the whole year.',
      JHT: 'Savings at BPJS Ketenagakerjaan, paid out when you stop working or retire.',
      JP: 'A monthly pension from BPJS Ketenagakerjaan once you retire.',
      'BPJS Kesehatan': 'National health insurance, for you and your family.',
      JKK: 'Work accident insurance, paid by your employer.',
      JKM: 'Death benefit for your family, paid by your employer.',
      PKWT: 'A fixed-term contract job. Taxed like a permanent one each month, plus compensation when the contract ends.',
    },
    takeHome: 'Take-home pay',
    noExactGross: (amount: string) =>
      `No gross pays exactly ${amount}, it sits on a tax bracket edge. This is the closest one that pays more.`,
    monthly: 'Every month, January to November',
    grossSalary: 'Gross salary',
    bonusMonth: 'The month with your bonus',
    bonusMonthHint:
      "The bonus is added to that month's pay, so the TER rate goes up for the month.",
    bonusRow: 'Bonus',
    takeHomeThatMonth: 'Take-home that month',
    december: 'December',
    decemberHint: (yearTax: string, withheld: string, refund: boolean) =>
      `The year's tax is re-counted with the Pasal 17 rates: ${yearTax}, of which ${withheld} was already taken January to November. December ${refund ? 'pays back the extra' : 'takes the rest'}.`,
    paidBack: 'PPh 21 paid back',
    takeHomeDecember: 'Take-home in December',
    fixedTakeHome: (net: string) =>
      `If your offer fixes the take-home (PPh ditanggung perusahaan or gross-up), December stays at ${net} and your employer settles the tax difference, whichever way it goes.`,
    contractEnds: 'When the contract ends',
    compensationHint: (months: number) =>
      `Compensation of ${months} months ÷ 12 of your salary (PP 35/2021).`,
    compensationNote:
      'No tax rule names it, so employers tax it one of the two ways below. Ask HR which.',
    compensation: 'Compensation',
    asSeverance: 'Tax as severance (final)',
    withPay: 'Or tax added to your pay',
    employer: 'Paid by your employer',
    employerHint: (taxable: string) =>
      `Not in your pay, but JKK, JKM and BPJS Kesehatan count toward the ${taxable} the tax is worked out on.`,
    outdated: (asOf: string) =>
      `These rates are from ${asOf} and may be out of date.`,
    footnote: (asOf: string, jpCap: string, kesCap: string) =>
      `For a whole year at this salary. A contract that ends mid-year settles the year's tax in its last month instead of December. Rates as of ${asOf}. JP is capped at a salary of ${jpCap} and BPJS Kesehatan at ${kesCap}.`,
  },
  {
    tabs: ['Gaji', 'Rincian'],
    known: {
      gross: {
        label: 'Gross',
        field: 'Gaji gross per bulan',
        hint: 'Gaji pokok plus tunjangan tetap, dalam rupiah, sebelum dipotong apa-apa.',
      },
      net: {
        label: 'Take-home',
        field: 'Take-home pay per bulan',
        hint: 'Yang masuk ke rekening kamu (THP), dalam rupiah. Gaji gross-nya dihitung dari angka ini.',
      },
    },
    amountIs: 'Angka ini',
    status: 'Status pajak (PTKP)',
    statusHint:
      'TK itu belum kawin, K itu kawin, dan angkanya jumlah tanggungan yang kamu klaim, maksimal 3.',
    employment: 'Status kerja',
    jobs: { permanent: 'Karyawan tetap', contract: 'Kontrak (PKWT)' },
    months: 'Lama kontrak (bulan)',
    monthsHint:
      'Kontraknya jalan berapa bulan. Tiap bulan dipajakin sama kayak karyawan tetap; di akhir kontrak ada uang kompensasi.',
    bonus: 'Bonus, THR, atau lembur (opsional)',
    bonusHint:
      'Dibayar sekali tahun ini di luar gaji. Dipajakin di bulan dibayarnya, tanpa potongan BPJS.',
    jkk: 'Risiko kerja (JKK)',
    jkkLevels: [
      'Sangat rendah (kantor)',
      'Rendah',
      'Sedang',
      'Tinggi',
      'Sangat tinggi',
    ],
    jkkHint:
      'Tergantung bidang usaha kantor kamu. Kebanyakan kerjaan kantoran masuk sangat rendah.',
    termsTitle: 'Arti istilahnya',
    terms: {
      THP: 'Gaji bersih yang masuk ke rekening kamu tiap bulan.',
      THR: 'Tunjangan hari raya, biasanya sebesar sebulan gaji, dibayar sebelum Lebaran atau hari raya agamamu.',
      PTKP: 'Batas penghasilan bebas pajak kamu. TK itu belum kawin, K itu kawin, dan angkanya jumlah tanggungan yang kamu klaim.',
      'PPh 21':
        'Pajak penghasilan yang dipotong kantor dari gajimu, terus disetorin atas nama kamu.',
      TER: 'Tarif PPh 21 bulanan, tergantung gaji gross dan status PTKP kamu.',
      'Pasal 17':
        'Tarif pajak penghasilan tahunan, 5% sampai 35%, yang dipakai di bulan Desember buat ngitung ulang pajak setahun penuh.',
      JHT: 'Tabungan di BPJS Ketenagakerjaan, bisa dicairin pas kamu berhenti kerja atau pensiun.',
      JP: 'Uang pensiun bulanan dari BPJS Ketenagakerjaan setelah kamu pensiun.',
      'BPJS Kesehatan': 'Jaminan kesehatan nasional, buat kamu dan keluarga.',
      JKK: 'Asuransi kecelakaan kerja, dibayar kantor.',
      JKM: 'Santunan kematian buat keluarga, dibayar kantor.',
      PKWT: 'Kerja dengan kontrak waktu tertentu. Tiap bulan dipajakin kayak karyawan tetap, plus uang kompensasi pas kontraknya selesai.',
    },
    takeHome: 'Take-home pay',
    noExactGross: (amount: string) =>
      `Nggak ada gaji gross yang hasilnya pas ${amount}, soalnya angka ini jatuh di batas lapisan tarif pajak. Ini yang paling dekat, hasilnya sedikit lebih besar.`,
    monthly: 'Setiap bulan, Januari sampai November',
    grossSalary: 'Gaji gross',
    bonusMonth: 'Bulan pas bonus dibayar',
    bonusMonthHint:
      'Bonus ditambahin ke gaji bulan itu, jadi tarif TER-nya naik buat bulan itu.',
    bonusRow: 'Bonus',
    takeHomeThatMonth: 'Take-home bulan itu',
    december: 'Desember',
    decemberHint: (yearTax: string, withheld: string, refund: boolean) =>
      `Pajak setahun dihitung ulang pakai tarif Pasal 17: ${yearTax}, dan ${withheld} di antaranya udah dipotong Januari sampai November. Desember ${refund ? 'ngembaliin kelebihannya' : 'motong sisanya'}.`,
    paidBack: 'PPh 21 dikembalikan',
    takeHomeDecember: 'Take-home bulan Desember',
    fixedTakeHome: (net: string) =>
      `Kalau tawaranmu nge-fix take-home (PPh ditanggung perusahaan atau gross-up), Desember tetap ${net} dan selisih pajaknya diberesin kantor, ke arah mana pun.`,
    contractEnds: 'Pas kontrak selesai',
    compensationHint: (months: number) =>
      `Uang kompensasi sebesar ${months} bulan ÷ 12 dari gajimu (PP 35/2021).`,
    compensationNote:
      'Belum ada aturan pajak yang nyebut ini secara khusus, jadi kantor biasanya majakin pakai salah satu dari dua cara di bawah. Tanya HR yang mana.',
    compensation: 'Kompensasi',
    asSeverance: 'Pajak sebagai pesangon (final)',
    withPay: 'Atau pajaknya digabung ke gaji',
    employer: 'Dibayar kantor',
    employerHint: (taxable: string) =>
      `Nggak masuk ke gajimu, tapi JKK, JKM, dan BPJS Kesehatan ikut dihitung dalam ${taxable} yang jadi dasar pajaknya.`,
    outdated: (asOf: string) =>
      `Tarif ini per ${asOf} dan mungkin udah nggak berlaku.`,
    footnote: (asOf: string, jpCap: string, kesCap: string) =>
      `Buat setahun penuh dengan gaji ini. Kontrak yang selesai di tengah tahun beresin pajak setahunnya di bulan terakhir kontrak, bukan di Desember. Tarif per ${asOf}. Dasar JP dibatasi di gaji ${jpCap} dan BPJS Kesehatan di ${kesCap}.`,
  }
);

const SalaryPage = () => {
  const { lang } = useLang();
  const t = T[lang];
  const asOf = RATES_AS_OF.toLocaleDateString(LOCALES[lang], {
    month: 'long',
    year: 'numeric',
  });
  const [known, setKnown] = useState<'gross' | 'net'>('gross');
  const [amount, setAmount] = useState(0);
  const [status, setStatus] = useState<PtkpStatus>('TK/0');
  const [bonus, setBonus] = useState(0);
  const [jkk, setJkk] = useState<number>(JKK_RATES[0]);
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
      tabs={t.tabs}
      form={
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="salary">{t.known[known].field}</FieldLabel>
            <Toggle
              label={t.amountIs}
              value={known}
              options={{
                gross: t.known.gross.label,
                net: t.known.net.label,
              }}
              onChange={setKnown}
            />
            <RupiahInput
              id="salary"
              value={amount}
              onChange={setAmount}
              placeholder="10.000.000"
            />
            <FieldDescription>{t.known[known].hint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="status">{t.status}</FieldLabel>
            <Select
              id="status"
              value={status}
              onChange={e => setStatus(e.target.value as PtkpStatus)}
            >
              {PTKP_STATUSES.map(value => (
                <option key={value}>{value}</option>
              ))}
            </Select>
            <FieldDescription>{t.statusHint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>{t.employment}</FieldLabel>
            <Toggle
              label={t.employment}
              value={job}
              options={t.jobs}
              onChange={setJob}
            />
            {job === 'contract' && (
              <>
                <FieldLabel htmlFor="months" className="pt-2">
                  {t.months}
                </FieldLabel>
                <Input
                  id="months"
                  type="number"
                  min={1}
                  placeholder="12"
                  value={months || ''}
                  onChange={e => setMonths(Number(e.target.value))}
                />
                <FieldDescription>{t.monthsHint}</FieldDescription>
              </>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="bonus">{t.bonus}</FieldLabel>
            <RupiahInput
              id="bonus"
              value={bonus}
              onChange={setBonus}
              placeholder="0"
            />
            <FieldDescription>{t.bonusHint}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="jkk">{t.jkk}</FieldLabel>
            <Select
              id="jkk"
              value={jkk}
              onChange={e => setJkk(Number(e.target.value))}
            >
              {JKK_RATES.map((bps, i) => (
                <option key={bps} value={bps}>
                  {t.jkkLevels[i]}, {percent(bps)}
                </option>
              ))}
            </Select>
            <FieldDescription>{t.jkkHint}</FieldDescription>
          </Field>
          <section className="space-y-3 border-t pt-6">
            <h2 className="text-sm font-medium">{t.termsTitle}</h2>
            <dl className="space-y-3 text-xs/relaxed">
              {TERMS.map(([term, name]) => (
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
                  <dd className="text-muted-foreground">{t.terms[term]}</dd>
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
            aria-label={t.takeHome}
            className="min-h-0 space-y-6 overflow-y-auto rounded-md border p-4 text-sm"
          >
            {known === 'net' && pay.net !== amount && (
              <Note>{t.noExactGross(rupiah(amount))}</Note>
            )}
            <section className="space-y-2">
              <h2 className="font-medium">{t.monthly}</h2>
              <dl>
                <Row label={t.grossSalary} value={salary} />
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
                <Row label={t.takeHome} value={pay.net} strong />
              </dl>
            </section>
            {bonus > 0 && (
              <section className="space-y-2">
                <h2 className="font-medium">{t.bonusMonth}</h2>
                <p className="text-muted-foreground text-xs">
                  {t.bonusMonthHint}
                </p>
                <dl>
                  <Row label={t.bonusRow} value={bonus} />
                  <Row
                    label={`PPh 21 (${bonusMonth.rate.toLocaleString('id-ID')}% TER)`}
                    value={bonusMonth.deductions.pph21}
                    minus
                  />
                  <Row
                    label={t.takeHomeThatMonth}
                    value={bonusMonth.net}
                    strong
                  />
                </dl>
              </section>
            )}
            <section className="space-y-2">
              <h2 className="font-medium">{t.december}</h2>
              <p className="text-muted-foreground text-xs">
                {t.decemberHint(
                  rupiah(dec.yearTax),
                  rupiah(dec.withheld),
                  dec.pph21 < 0
                )}
              </p>
              <dl>
                {dec.pph21 < 0 ? (
                  <Row label={t.paidBack} value={-dec.pph21} />
                ) : (
                  <Row label="PPh 21" value={dec.pph21} minus />
                )}
                <Row label={t.takeHomeDecember} value={dec.net} strong />
              </dl>
              {known === 'net' && amount > 0 && dec.net !== pay.net && (
                <Note>{t.fixedTakeHome(rupiah(pay.net))}</Note>
              )}
            </section>
            {job === 'contract' && (
              <section className="space-y-2">
                <h2 className="font-medium">{t.contractEnds}</h2>
                <p className="text-muted-foreground text-xs">
                  {t.compensationHint(months)}
                </p>
                <Note>{t.compensationNote}</Note>
                <dl>
                  <Row label={t.compensation} value={comp.amount} />
                  <Row label={t.asSeverance} value={comp.asSeverance} minus />
                  <Row label={t.withPay} value={comp.withPay} minus />
                </dl>
              </section>
            )}
            <section className="space-y-2">
              <h2 className="font-medium">{t.employer}</h2>
              <p className="text-muted-foreground text-xs">
                {t.employerHint(rupiah(pay.taxable))}
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
              {t.outdated(asOf)}
            </p>
          )}
          <FieldDescription>
            {t.footnote(asOf, rupiah(JP_CAP), rupiah(KES_CAP))}
          </FieldDescription>
        </div>
      }
    />
  );
};

export default SalaryPage;

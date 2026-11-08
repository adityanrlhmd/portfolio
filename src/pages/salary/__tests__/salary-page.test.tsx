import { fireEvent, render, screen, within } from '@testing-library/react';

import SalaryPage from '../salary-page';

describe('SalaryPage', () => {
  it('shows Rp0 until a salary is typed', () => {
    render(<SalaryPage />);
    const result = screen.getByRole('region', { name: 'Take-home pay' });
    expect(
      within(result).getByText('Take-home pay').nextSibling
    ).toHaveTextContent('Rp0');
  });

  it('shows the take-home pay for the typed salary and status', () => {
    render(<SalaryPage />);
    const input = screen.getByLabelText<HTMLInputElement>(
      'Monthly gross salary'
    );
    fireEvent.change(input, { target: { value: 'Rp 20.000.000' } });
    expect(input.value).toBe('20.000.000');
    fireEvent.change(screen.getByLabelText('Tax status (PTKP)'), {
      target: { value: 'K/1' },
    });

    const result = screen.getByRole('region', { name: 'Take-home pay' });
    expect(within(result).getByText('PPh 21 (8% TER)')).toBeInTheDocument();
    expect(
      within(result).getByText('Take-home pay').nextSibling
    ).toHaveTextContent('Rp17.722.097');
  });

  it('works the gross back from a take-home amount', async () => {
    render(<SalaryPage />);
    fireEvent.click(screen.getByRole('button', { name: 'Take-home' }));
    fireEvent.change(screen.getByLabelText('Monthly take-home pay'), {
      target: { value: '9.338.650' },
    });
    const result = screen.getByRole('region', { name: 'Take-home pay' });
    expect(
      within(result).getByText('Gross salary').nextSibling
    ).toHaveTextContent('Rp10.000.000');
  });

  it('shows the bonus month and December', () => {
    render(<SalaryPage />);
    fireEvent.change(screen.getByLabelText('Monthly gross salary'), {
      target: { value: '10.000.000' },
    });
    fireEvent.change(
      screen.getByLabelText('Bonus, THR or overtime (optional)'),
      {
        target: { value: '10.000.000' },
      }
    );
    const result = screen.getByRole('region', { name: 'Take-home pay' });
    expect(
      within(result).getByText('Take-home that month').nextSibling
    ).toHaveTextContent('Rp17.759.140');
    expect(within(result).getByText('PPh 21').nextSibling).toHaveTextContent(
      'Rp322.840'
    );
  });

  it('shows the end-of-contract compensation, taxed both ways', () => {
    render(<SalaryPage />);
    fireEvent.change(screen.getByLabelText('Monthly gross salary'), {
      target: { value: '10.000.000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Contract (PKWT)' }));
    fireEvent.change(screen.getByLabelText('Contract length (months)'), {
      target: { value: '6' },
    });
    const result = screen.getByRole('region', { name: 'Take-home pay' });
    expect(
      within(result).getByText('Compensation').nextSibling
    ).toHaveTextContent('Rp5.000.000');
    expect(
      within(result).getByText('Tax as severance (final)').nextSibling
    ).toHaveTextContent('Rp0');
  });
});

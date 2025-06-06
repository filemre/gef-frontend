import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
jest.mock('../../api', () => ({ post: jest.fn() }));
import ContactPage from '../ContactPage';

describe('ContactPage', () => {
  it('form alanları ve gönder butonu görünür', () => {
    render(<ContactPage />);
    expect(screen.getByPlaceholderText('Adınız')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-posta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mesajınız')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /gönder/i })).toBeInTheDocument();
  });

  it('form doğrulama çalışıyor', () => {
    render(<ContactPage />);
    const button = screen.getByRole('button', { name: /gönder/i });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText('Adınız'), { target: { value: 'Test Kullanıcı' } });
    fireEvent.change(screen.getByPlaceholderText('E-posta'), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mesajınız'), { target: { value: 'Merhaba' } });
    expect(button).not.toBeDisabled();
  });
});

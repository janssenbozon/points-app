import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import Login from '../pages/login';
import { act } from 'react-dom/test-utils';
import { useAuth } from '../hooks/useAuth';

// Mock the useRouter hook
jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
}));

// Mock the useAuth hook
jest.mock('../hooks/useAuth', () => ({
    useAuth: jest.fn(() => ({
        generateRecaptcha: jest.fn(),
        verifyOTP: jest.fn(),
        userExists: jest.fn(),
        requestOTP: jest.fn(),
    })),
}));

describe('Login Component', () => {
    beforeEach(() => {
        render(<Login />);
    });

    test('renders phone input when component is mounted', () => {
        const phoneInput = screen.getByPlaceholderText('(000) 000 - 0000');
        expect(phoneInput).toBeInTheDocument();
    });

    test('shows error message for invalid phone number', () => {
        const phoneInput = screen.getByPlaceholderText('(000) 000 - 0000');
        const submitButton = screen.getByText('Submit');

        fireEvent.change(phoneInput, { target: { value: '123' } });
        fireEvent.click(submitButton);

        const errorMessage = screen.getByText('Please enter a valid phone number.');
        expect(errorMessage).toBeInTheDocument();
    });

    // test('displays code input after submitting valid phone number', async () => {
        
    //     const phoneInput = screen.getByPlaceholderText('(000) 000 - 0000');
    //     const submitButton = screen.getByText('Submit');

    //     act(() => {
    //         fireEvent.change(phoneInput, { target: { value: '2816787625' } });
    //         fireEvent.click(submitButton);
    //     });

    //     await waitFor(() => {
    //         expect(screen.getByText('We sent you a code!')).toBeInTheDocument();
    //         expect(screen.getByText('Please enter it below.')).toBeInTheDocument();
    //     });
    // });

    // test('shows error message for incorrect code input', async () => {
    //     const phoneInput = screen.getByPlaceholderText('(000) 000 - 0000');
    //     const submitButton = screen.getByText('Submit');

    //     act(() => {
    //         fireEvent.change(phoneInput, { target: { value: '2816787625' } });
    //         fireEvent.click(submitButton);
    //     });

    //     const codeInput = await screen.getByText('We sent you a code!');
    //     const verifyButton = screen.getByText('Submit');

    //     act(() => {
    //         fireEvent.change(codeInput, { target: { value: '123' } });
    //         fireEvent.click(verifyButton);
    //     });

    //     const errorMessage = await screen.findByText('Incorrect code. Please try again.');
    //     expect(errorMessage).toBeInTheDocument();
    // });

    // Add more tests as needed for different scenarios and functionality
});

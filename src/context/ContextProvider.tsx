import { type ReactNode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { HeadProvider } from 'react-head';

interface ContextProviderProps {
    children: ReactNode;
}

export default function ContextProvider({ children }: ContextProviderProps): React.ReactElement {
    return (
        <AuthProvider>
            <ThemeProvider>
                <HeadProvider>
                    <Router>{children}</Router>
                </HeadProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

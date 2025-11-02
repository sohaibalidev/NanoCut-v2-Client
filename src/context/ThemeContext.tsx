import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import '@/styles/theme.css';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const getInitialTheme = (): Theme => {
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved) return saved;

        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        return prefersLight ? 'light' : 'dark';
    };

    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'light') {
            root.setAttribute('data-theme', 'light');
        } else {
            root.removeAttribute('data-theme');
        }

        localStorage.setItem('theme', theme);

        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

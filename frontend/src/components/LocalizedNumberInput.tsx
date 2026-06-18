import React from 'react';

interface LocalizedNumberInputProps {
    value: number;
    onChange: (v: number) => void;
    language: string;
}

export const formatLocalizedNumber = (value: number, language: string) => {
    if (isNaN(value)) return '';
    const formatter = new Intl.NumberFormat(language === 'hu' ? 'hu-HU' : 'en-US', {
        maximumFractionDigits: 4,
        useGrouping: true
    });
    return formatter.format(value);
};

export const LocalizedNumberInput = ({ value, onChange, language }: LocalizedNumberInputProps) => {
    const [localValue, setLocalValue] = React.useState(() => formatLocalizedNumber(value, language));

    React.useEffect(() => {
        const normalizedLocal = localValue.replace(/\s/g, '').replace(',', '.');
        const parsedLocal = parseFloat(normalizedLocal);
        if (parsedLocal !== value && !isNaN(value)) {
            setLocalValue(formatLocalizedNumber(value, language));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    React.useEffect(() => {
        if (!isNaN(value)) {
            setLocalValue(formatLocalizedNumber(value, language));
        }
    }, [language]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[\d\s,.-]*$/.test(val)) {
            setLocalValue(val);
            const normalized = val.replace(/\s/g, '').replace(',', '.');
            if (normalized && normalized !== '-' && normalized !== '.') {
                const parsed = parseFloat(normalized);
                if (!isNaN(parsed)) {
                    onChange(parsed);
                }
            } else if (val === '') {
                onChange(0);
            }
        }
    };

    const handleBlur = () => {
        if (!isNaN(value)) {
            setLocalValue(formatLocalizedNumber(value, language));
        }
    };

    const increment = () => onChange(Math.round(((value || 0) + 1) * 100) / 100);
    const decrement = () => onChange(Math.max(0, Math.round(((value || 0) - 1) * 100) / 100));

    return (
        <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white w-28 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all shadow-sm h-[28px]">
            <button type="button" onClick={decrement} className="px-2 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium border-r border-slate-200 select-none">-</button>
            <input 
                type="text" 
                value={localValue}
                onChange={handleInput}
                onBlur={handleBlur}
                className="w-full h-full text-center px-1 text-slate-700 outline-none bg-transparent text-sm font-semibold"
            />
            <button type="button" onClick={increment} className="px-2 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium border-l border-slate-200 select-none">+</button>
        </div>
    );
};

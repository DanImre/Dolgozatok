import React from 'react';

interface LocalizedNumberInputProps {
    value: number;
    onChange: (v: number) => void;
    language: string;
    hideButtons?: boolean;
    className?: string;
    placeholder?: string;
}

export const formatLocalizedNumber = (value: number, language: string) => {
    if (isNaN(value)) return '';
    const formatter = new Intl.NumberFormat(language === 'hu' ? 'hu-HU' : 'en-US', {
        maximumFractionDigits: 4,
        useGrouping: true
    });
    return formatter.format(value);
};

export const LocalizedNumberInput = ({ value, onChange, language, hideButtons, className, placeholder }: LocalizedNumberInputProps) => {
    const [localValue, setLocalValue] = React.useState(() => formatLocalizedNumber(value, language));

    const localValueRef = React.useRef(localValue);
    localValueRef.current = localValue;
    const languageRef = React.useRef(language);
    languageRef.current = language;

    React.useEffect(() => {
        let normalizedLocal = localValueRef.current.replace(/\s/g, '');
        if (languageRef.current === 'hu') {
            normalizedLocal = normalizedLocal.replace(',', '.');
        } else {
            normalizedLocal = normalizedLocal.replace(/,/g, '');
        }
        const parsedLocal = parseFloat(normalizedLocal);
        if (parsedLocal !== value && !isNaN(value)) {
            setLocalValue(formatLocalizedNumber(value, languageRef.current));
        }
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
            let normalized = val.replace(/\s/g, '');
            if (language === 'hu') {
                normalized = normalized.replace(',', '.');
            } else {
                normalized = normalized.replace(/,/g, '');
            }
            if (normalized && normalized !== '-' && normalized !== '.') {
                const parsed = parseFloat(normalized);
                if (!isNaN(parsed)) {
                    onChange(parsed);
                }
            } else if (val === '') {
                onChange(NaN);
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
        <div className={className || "flex items-center border border-slate-200 rounded-md overflow-hidden bg-white w-28 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all shadow-sm h-[28px]"}>
            {!hideButtons && <button type="button" onClick={decrement} className="px-2 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium border-r border-slate-200 select-none">-</button>}
            <input 
                type="text" 
                value={localValue}
                onChange={handleInput}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={hideButtons ? "w-full h-full bg-transparent outline-none placeholder-slate-400" : "w-full h-full text-center px-1 text-slate-700 outline-none bg-transparent text-sm font-semibold"}
            />
            {!hideButtons && <button type="button" onClick={increment} className="px-2 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors font-medium border-l border-slate-200 select-none">+</button>}
        </div>
    );
};

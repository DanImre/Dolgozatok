import React, { useEffect, useState, useRef } from 'react';
import { formatLocalizedNumber } from './LocalizedNumberInput';
import { evaluate } from 'mathjs';

interface LocalizedExpressionInputProps {
    value: string;
    onChange: (v: string) => void;
    language: string;
    className?: string;
    placeholder?: string;
    showButtons?: boolean;
}

export const LocalizedExpressionInput: React.FC<LocalizedExpressionInputProps> = ({
    value, onChange, language, className, placeholder, showButtons
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Determine the correct decimal separator for the current language
    const decimalSeparator = language === 'hu' ? ',' : '.';
    const wrongSeparator = language === 'hu' ? '.' : ',';

    const [localValue, setLocalValue] = useState(value);

    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // When value or language changes, normalize the existing expression
    useEffect(() => {
        let normalized = value || '';
        if (normalized) {
            // Replace the wrong separator with the correct one
            normalized = normalized.split(wrongSeparator).join(decimalSeparator);
        }
        setLocalValue(normalized);
        if (normalized !== value) {
            onChangeRef.current(normalized);
        }
    }, [value, language, decimalSeparator, wrongSeparator]);

    const [evalResult, setEvalResult] = useState<string>('');

    // Evaluate the expression for display
    useEffect(() => {
        if (!localValue) {
            setEvalResult('');
            return;
        }

        try {
            // Convert to JS-evaluable string (commas -> dots)
            const evalStr = localValue.replace(/\s/g, '').replace(/,/g, '.');

            const result = evaluate(evalStr);
            if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
                setEvalResult(formatLocalizedNumber(result, language));
            } else {
                setEvalResult('error');
            }
        } catch {
            setEvalResult('error');
        }
    }, [localValue, language]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow digits, spaces, math operators, parentheses, and both separators
        if (/^[\d\s()+\-*/^.,]*$/.test(val)) {
            // Instantly replace wrong separator with correct one
            const corrected = val.split(wrongSeparator).join(decimalSeparator);
            setLocalValue(corrected);
            onChangeRef.current(corrected);
        }
    };

    const insertOperator = (op: string) => {
        const input = inputRef.current;
        let newText = localValue;
        let newCursorPos = newText.length;

        if (input) {
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            const before = newText.substring(0, start);
            const after = newText.substring(end);
            const selectedText = newText.substring(start, end);

            if (op === '()') {
                newText = `${before}(${selectedText})${after}`;
                if (selectedText.length === 0) {
                    newCursorPos = start + 1;
                } else {
                    newCursorPos = start + selectedText.length + 2;
                }
            } else {
                newText = `${before}${op}${after}`;
                newCursorPos = start + op.length;
            }
        } else {
            if (op === '()') {
                newText = newText + '()';
                newCursorPos = newText.length - 1;
            } else {
                newText = newText + op;
                newCursorPos = newText.length;
            }
        }

        setLocalValue(newText);
        onChangeRef.current(newText);
        
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    return (
        <div className="flex-1 flex flex-col w-full gap-2">
            <div className={`flex items-center w-full ${className || ""}`}>
                <input 
                    ref={inputRef}
                    type="text" 
                    value={localValue}
                    onChange={handleInput}
                    placeholder={placeholder}
                    className="w-full h-full bg-transparent outline-none flex-1 text-inherit font-inherit"
                />
                {evalResult && (
                    <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded ml-2 select-none ${evalResult === 'error' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'} border`}>
                        {evalResult === 'error' ? 'error' : `= ${evalResult}`}
                    </span>
                )}
            </div>
            {showButtons && (
                <div className="flex items-center gap-1.5 ml-2">
                    {['+', '-', '*', '/', '^', '()'].map(op => (
                        <button
                            key={op}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                insertOperator(op);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                        >
                            {op}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

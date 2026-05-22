import React, { useState, useEffect, useRef } from 'react';
import { parseRupiah } from '@/lib/currency';

/**
 * @param {Object}   props
 * @param {number}   props.value         
 * @param {Function} props.onChange       
 * @param {string}   [props.placeholder]  
 * @param {string}   [props.className]   
 * @param {boolean}  [props.disabled]
 * @param {string}   [props.id]
 * @param {string}   [props.name]
 */
export default function RupiahInput({
    value,
    onChange,
    placeholder = '0',
    className = '',
    disabled = false,
    id,
    name,
    ...rest
}) {
    // displayValue: yang tampil di input (string terformat)
    const [displayValue, setDisplayValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Sinkronisasi dari luar → dalam (misal saat reset form)
    useEffect(() => {
        if (!isFocused) {
            if (value === '' || value === null || value === undefined || value === 0) {
                setDisplayValue('');
            } else {
                // Format ulang nilai dari parent saat tidak focus
                const num = Number(value);
                if (!isNaN(num) && num !== 0) {
                    setDisplayValue(
                        new Intl.NumberFormat('id-ID').format(num)
                    );
                }
            }
        }
    }, [value, isFocused]);

    // Saat user focus: tampilkan hanya angka mentah supaya mudah diedit
    const handleFocus = (e) => {
        setIsFocused(true);
        const raw = parseRupiah(displayValue);
        setDisplayValue(raw === 0 ? '' : String(raw));
        // Seleksi semua teks agar mudah diganti
        setTimeout(() => e.target.select(), 0);
    };

    // Saat user blur: format ulang tampilan
    const handleBlur = () => {
        setIsFocused(false);
        const num = parseRupiah(displayValue);
        if (num === 0) {
            setDisplayValue('');
        } else {
            setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
        }
        onChange?.(num);
    };

    // Saat user mengetik
    const handleChange = (e) => {
        const raw = e.target.value;

        // Hanya izinkan digit
        const digitsOnly = raw.replace(/\D/g, '');

        // Hindari angka lebih dari 15 digit (batas aman JS integer)
        if (digitsOnly.length > 15) return;

        setDisplayValue(digitsOnly);

        // Kirim integer ke parent secara real-time
        const num = digitsOnly === '' ? 0 : parseInt(digitsOnly, 10);
        onChange?.(num);
    };

    return (
        <div className="relative">
            {/* Prefix "Rp" */}
            <span
                className={`
                    absolute left-3 top-1/2 -translate-y-1/2 select-none pointer-events-none
                    text-[14px] font-semibold transition-colors duration-150
                    ${isFocused ? 'text-orange-500' : 'text-neutral-400'}
                `}
            >
                Rp
            </span>

            <input
                ref={inputRef}
                id={id}
                name={name}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={disabled}
                placeholder={isFocused ? placeholder : ''}
                value={displayValue}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                autoComplete="off"
                className={`
                    pl-9 pr-4 py-3
                    text-[14px] font-mono tabular-nums
                    bg-neutral-50 border border-neutral-200 rounded-lg
                    text-neutral-900 placeholder:text-neutral-300
                    transition-all duration-150
                    focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${className}
                `}
                {...rest}
            />

            {/* Placeholder custom saat belum focus dan kosong */}
            {!isFocused && !displayValue && (
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-[14px] text-neutral-300 pointer-events-none select-none">
                    {placeholder}
                </span>
            )}
        </div>
    );
}
'use client'

import { ChevronUp, ChevronDown } from 'lucide-react'

type NumberInputProps = {
    id?: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    step?: number
    min?: number
    className?: string
}

export default function NumberInput({
    id,
    value,
    onChange,
    placeholder,
    step = 1,
    min,
    className = '',
}: NumberInputProps) {
    function handleIncrement() {
        const current = parseFloat(value) || 0
        const next = current + step
        onChange(next.toFixed(step < 1 ? 2 : 0))
    }

    function handleDecrement() {
        const current = parseFloat(value) || 0
        const next = current - step
        if (min !== undefined && next < min) {
            return
        }
        onChange(next.toFixed(step < 1 ? 2 : 0))
    }

    return (
        <div className="relative flex items-center w-full">
            <input
                id={id}
                type="number"
                step="any"
                min={min}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === '+' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault()
                    }
                }}
                placeholder={placeholder}
                className={`w-full bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl pl-4 pr-12 py-2.5 text-white outline-none focus:border-[#A3C5FF] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
            />
            <div className="absolute right-1.5 flex flex-col gap-0.5 justify-center">
                <button
                    type="button"
                    onClick={handleIncrement}
                    className="flex items-center justify-center text-[#A3C5FF] hover:text-[#82AFFF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 rounded-md p-0.5 transition-all cursor-pointer h-[15px] w-[26px]"
                >
                    <ChevronUp className="h-4 w-4 stroke-[3]" />
                </button>
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="flex items-center justify-center text-[#A3C5FF] hover:text-[#82AFFF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 rounded-md p-0.5 transition-all cursor-pointer h-[15px] w-[26px]"
                >
                    <ChevronDown className="h-4 w-4 stroke-[3]" />
                </button>
            </div>
        </div>
    )
}

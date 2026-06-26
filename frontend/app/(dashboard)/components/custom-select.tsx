'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

type SelectOption = {
    value: string
    label: string
}

type CustomSelectProps = {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    placeholder?: string
    className?: string
    buttonClassName?: string
}

export default function CustomSelect({
    value,
    onChange,
    options,
    placeholder = 'Wybierz...',
    className = '',
    buttonClassName = ''
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find((o) => o.value === value)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl px-3 py-2 text-white outline-none focus:border-[#A3C5FF] transition-colors cursor-pointer text-left text-sm ${buttonClassName}`}
            >
                <span className={selectedOption ? 'text-white' : 'text-[#94A3B8]'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <div className="flex items-center justify-center text-[#A3C5FF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 rounded-md p-0.5 transition-all h-[20px] w-[22px] cursor-pointer">
                    <ChevronDown className={`h-3 w-3 stroke-[3] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#161D30] border border-[#202E4C]/50 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto py-1.5 animate-fade-in scrollbar-thin scrollbar-thumb-[#202E4C]">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                                option.value === value
                                    ? 'bg-[#202E4C]/60 text-white font-semibold'
                                    : 'text-[#E2E8F0] hover:bg-[#202E4C]/40 hover:text-white'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

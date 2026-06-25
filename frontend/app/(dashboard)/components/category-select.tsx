'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Category } from '@/lib/api/types'

type CategorySelectProps = {
    value: string
    onChange: (value: string) => void
    categories: Category[]
    placeholder?: string
}

export default function CategorySelect({
    value,
    onChange,
    categories,
    placeholder = 'Wybierz kategorię...',
}: CategorySelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedCategory = categories.find((c) => String(c.id) === value)

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
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-[#0B0F19]/40 border border-[#202E4C]/30 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#A3C5FF] transition-colors cursor-pointer text-left text-sm"
            >
                <span className={selectedCategory ? 'text-white' : 'text-[#94A3B8]'}>
                    {selectedCategory ? selectedCategory.name : placeholder}
                </span>
                <div className="flex items-center justify-center text-[#A3C5FF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 rounded-md p-0.5 transition-all h-[24px] w-[26px] cursor-pointer">
                    <ChevronDown className={`h-4 w-4 stroke-[3] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-[#161D30] border border-[#202E4C]/50 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto py-1.5 animate-fade-in scrollbar-thin scrollbar-thumb-[#202E4C]">
                    <button
                        type="button"
                        onClick={() => {
                            onChange('')
                            setIsOpen(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#94A3B8] hover:bg-[#202E4C]/40 hover:text-white transition-colors cursor-pointer"
                    >
                        {placeholder}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => {
                                onChange(String(category.id))
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                                String(category.id) === value
                                    ? 'bg-[#202E4C]/60 text-white font-semibold'
                                    : 'text-[#E2E8F0] hover:bg-[#202E4C]/40 hover:text-white'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type TransactionPaginationProps = {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function TransactionPagination({
    currentPage,
    totalPages,
    onPageChange
}: TransactionPaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="flex items-center justify-center text-[#A3C5FF] hover:text-[#82AFFF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 disabled:opacity-30 disabled:hover:text-[#A3C5FF] disabled:hover:bg-[#202E4C]/40 rounded-xl p-2.5 transition-all cursor-pointer disabled:cursor-not-allowed border border-[#202E4C]/30"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-white">
                Strona {currentPage} z {totalPages}
            </span>
            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="flex items-center justify-center text-[#A3C5FF] hover:text-[#82AFFF] bg-[#202E4C]/40 hover:bg-[#202E4C]/70 disabled:opacity-30 disabled:hover:text-[#A3C5FF] disabled:hover:bg-[#202E4C]/40 rounded-xl p-2.5 transition-all cursor-pointer disabled:cursor-not-allowed border border-[#202E4C]/30"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}

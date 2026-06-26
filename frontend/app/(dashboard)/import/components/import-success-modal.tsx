'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'

type ImportSuccessModalProps = {
    count: number
    onReset: () => void
}

export default function ImportSuccessModal({ count, onReset }: ImportSuccessModalProps) {
    const router = useRouter()

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#161D30] border border-[#202E4C] rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center mx-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Import zakończony sukcesem</h3>
                <p className="text-[#94A3B8] mb-8">
                    Pomyślnie dodano {count} transakcj{count === 1 ? 'ę' : count > 1 && count < 5 ? 'e' : 'i'} do Twojej historii.
                </p>
                
                <div className="flex flex-col w-full gap-3">
                    <button
                        onClick={() => router.push('/transactions')}
                        className="w-full bg-[#A3C5FF] text-[#0B0F19] hover:bg-[#8AB4F8] transition-colors py-3 rounded-xl font-bold shadow-lg shadow-[#A3C5FF]/10 cursor-pointer"
                    >
                        Otwórz historię transakcji
                    </button>
                    <button
                        onClick={onReset}
                        className="w-full bg-[#202E4C]/40 hover:bg-[#202E4C]/70 border border-[#202E4C]/50 text-white transition-colors py-3 rounded-xl font-bold cursor-pointer"
                    >
                        Wgraj kolejne transakcje
                    </button>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { changePasswordAction } from '@/app/actions/profile'
import { KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ChangePasswordForm() {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Wypełnij wszystkie pola')
            setIsLoading(false)
            return
        }

        if (newPassword.length < 8) {
            setError('Nowe hasło musi mieć co najmniej 8 znaków')
            setIsLoading(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Nowe hasła nie są identyczne')
            setIsLoading(false)
            return
        }

        const result = await changePasswordAction({ currentPassword, newPassword })

        setIsLoading(false)

        if (result.success) {
            router.push('/login')
            router.refresh()
        } else {
            setError(result.message || 'Wystąpił nieznany błąd')
        }
    }

    return (
        <div className="bg-[#1C253D] rounded-2xl p-6 border border-[#2A3756]">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Zmiana hasła</h3>
                <p className="text-sm text-[#94A3B8]">
                    Ze względów bezpieczeństwa po zmianie hasła konieczne będzie ponowne zalogowanie.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Aktualne hasło
                    </label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-[#161D30] border border-[#2A3756] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Wpisz obecne hasło"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Nowe hasło
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#161D30] border border-[#2A3756] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Wpisz nowe hasło (min. 8 znaków)"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Potwierdź nowe hasło
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-[#161D30] border border-[#2A3756] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Powtórz nowe hasło"
                        required
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#82afff] hover:bg-[#82afff]/90 text-slate-900 font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <KeyRound className="w-5 h-5" />
                        {isLoading ? 'Zapisywanie...' : 'Zmień hasło'}
                    </button>
                </div>
            </form>
        </div>
    )
}

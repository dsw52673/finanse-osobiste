'use client'

import { useState } from 'react'
import { changeEmailAction } from '@/app/actions/profile'
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ChangeEmailForm() {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        if (!currentPassword || !newEmail) {
            setError('Wypełnij wszystkie pola')
            setIsLoading(false)
            return
        }

        const result = await changeEmailAction({ currentPassword, newEmail })

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
                <h3 className="text-lg font-semibold text-white mb-2">Zmiana adresu e-mail</h3>
                <p className="text-sm text-[#94A3B8]">
                    Po pomyślnej zmianie adresu e-mail nastąpi wylogowanie z konta.
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
                        Nowy adres e-mail
                    </label>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-[#161D30] border border-[#2A3756] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Wpisz nowy e-mail"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Aktualne hasło (wymagane)
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#82afff] hover:bg-[#82afff]/90 text-slate-900 font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? 'Zapisywanie...' : 'Zmień e-mail'}
                    </button>
                </div>
            </form>
        </div>
    )
}

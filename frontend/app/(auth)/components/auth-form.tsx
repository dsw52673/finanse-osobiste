'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { loginAction, registerAction } from '../actions'

type AuthFormProps = {
    mode: 'login' | 'register'
}

type FieldErrors = {
    email?: string
    password?: string
    confirmPassword?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [actionError, setActionError] = useState<string | null>(null)

    const isRegister = mode === 'register'

    function validate(): boolean {
        const errors: FieldErrors = {}

        if (!email.trim()) {
            errors.email = 'Adres e-mail jest wymagany'
        } else if (!EMAIL_REGEX.test(email.trim())) {
            errors.email = 'Podaj poprawny adres e-mail'
        }

        if (!password) {
            errors.password = 'Hasło jest wymagane'
        } else if (isRegister && password.length < 8) {
            errors.password = 'Hasło musi mieć co najmniej 8 znaków'
        }

        if (isRegister) {
            if (!confirmPassword) {
                errors.confirmPassword = 'Powtórz hasło'
            } else if (password !== confirmPassword) {
                errors.confirmPassword = 'Hasła muszą być identyczne'
            }
        }

        setFieldErrors(errors)

        return Object.keys(errors).length === 0
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setActionError(null)

        if (!validate()) {
            return
        }

        startTransition(async () => {
            try {
                if (isRegister) {
                    const result = await registerAction({
                        email: email.trim(),
                        password,
                    })

                    if (result.success) {
                        router.replace('/login')
                        return
                    }

                    setActionError(
                        result.message ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
                    )
                    return
                }

                const result = await loginAction({
                    email: email.trim(),
                    password,
                })

                if (result.success) {
                    router.replace('/')
                    return
                }

                setActionError(
                    result.message ?? 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
                )
            } catch {
                setActionError('Wystąpił nieoczekiwany błąd. Spróbuj ponownie.')
            }
        })
    }

    const submitLabel = isRegister ? 'Zarejestruj się' : 'Zaloguj się'
    const pendingLabel = isRegister ? 'Tworzenie konta...' : 'Logowanie...'
    const heading = isRegister ? 'Utwórz konto' : 'Zaloguj się'

    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-xl border border-dusty-denim-200 bg-alabaster-grey-50 p-8 shadow-sm dark:border-dusty-denim-700 dark:bg-ink-black-900">
                <h1 className="mb-8 text-center text-2xl font-semibold text-ink-black-950 dark:text-ink-black-50">
                    {heading}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-ink-black-800 dark:text-ink-black-100"
                        >
                            Adres e-mail
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            aria-invalid={fieldErrors.email ? true : undefined}
                            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                            className="w-full rounded-lg border border-dusty-denim-300 bg-white px-3 py-2 text-ink-black-950 outline-none transition-colors focus:border-prussian-blue-500 focus:ring-2 focus:ring-prussian-blue-200 aria-invalid:border-red-500 dark:border-dusty-denim-600 dark:bg-ink-black-800 dark:text-ink-black-50 dark:focus:border-prussian-blue-400 dark:focus:ring-prussian-blue-800"
                        />
                        {fieldErrors.email && (
                            <p id="email-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                                {fieldErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-sm font-medium text-ink-black-800 dark:text-ink-black-100"
                        >
                            Hasło
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            aria-invalid={fieldErrors.password ? true : undefined}
                            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                            className="w-full rounded-lg border border-dusty-denim-300 bg-white px-3 py-2 text-ink-black-950 outline-none transition-colors focus:border-prussian-blue-500 focus:ring-2 focus:ring-prussian-blue-200 aria-invalid:border-red-500 dark:border-dusty-denim-600 dark:bg-ink-black-800 dark:text-ink-black-50 dark:focus:border-prussian-blue-400 dark:focus:ring-prussian-blue-800"
                        />
                        {fieldErrors.password && (
                            <p id="password-error" className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                                {fieldErrors.password}
                            </p>
                        )}
                    </div>

                    {isRegister && (
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1.5 block text-sm font-medium text-ink-black-800 dark:text-ink-black-100"
                            >
                                Powtórz hasło
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                aria-invalid={fieldErrors.confirmPassword ? true : undefined}
                                aria-describedby={
                                    fieldErrors.confirmPassword ? 'confirm-password-error' : undefined
                                }
                                className="w-full rounded-lg border border-dusty-denim-300 bg-white px-3 py-2 text-ink-black-950 outline-none transition-colors focus:border-prussian-blue-500 focus:ring-2 focus:ring-prussian-blue-200 aria-invalid:border-red-500 dark:border-dusty-denim-600 dark:bg-ink-black-800 dark:text-ink-black-50 dark:focus:border-prussian-blue-400 dark:focus:ring-prussian-blue-800"
                            />
                            {fieldErrors.confirmPassword && (
                                <p
                                    id="confirm-password-error"
                                    className="mt-1.5 text-sm text-red-600 dark:text-red-400"
                                >
                                    {fieldErrors.confirmPassword}
                                </p>
                            )}
                        </div>
                    )}

                    {actionError && (
                        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                            {actionError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-lg bg-prussian-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-prussian-blue-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-prussian-blue-500 dark:hover:bg-prussian-blue-600"
                    >
                        {isPending ? pendingLabel : submitLabel}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-dusty-denim-600 dark:text-dusty-denim-300">
                    {isRegister ? (
                        <>
                            Masz już konto?{' '}
                            <Link
                                href="/login"
                                className="font-medium text-prussian-blue-600 hover:underline dark:text-prussian-blue-400"
                            >
                                Zaloguj się
                            </Link>
                        </>
                    ) : (
                        <>
                            Nie masz konta?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-prussian-blue-600 hover:underline dark:text-prussian-blue-400"
                            >
                                Zarejestruj się
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

import { ChangeEmailForm } from '../components/change-email-form'
import { ChangePasswordForm } from '../components/change-password-form'

export const metadata = {
    title: 'Profil - Finanse Osobiste',
}

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChangeEmailForm />
                <ChangePasswordForm />
            </div>
        </div>
    )
}

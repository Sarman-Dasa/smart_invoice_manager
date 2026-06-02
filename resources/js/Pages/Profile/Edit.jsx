import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Profile Settings' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Profile Settings</h2>
                </div>
            </div>

            <div className="py-2">
                <div className="mx-auto max-w-7xl space-y-4">
                    <div className="bg-white p-4 shadow-sm border rounded">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow-sm border rounded">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-4 shadow-sm border rounded">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="h4 fw-semibold mb-0">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            You're logged in! Welcome to Smart Invoice Manager.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

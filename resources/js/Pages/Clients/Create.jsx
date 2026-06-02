import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import ClientForm from '@/Components/Clients/ClientForm';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        company_name: '',
        address: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('clients.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Client" />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Clients', href: route('clients.index') },
                        { label: 'Create Client' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Add New Client</h2>
                </div>
                <Link href={route('clients.index')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left"></i> Back
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <ClientForm 
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        isEdit={false}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

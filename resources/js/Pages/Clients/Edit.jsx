import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import ClientForm from '@/Components/Clients/ClientForm';

export default function Edit({ client }) {
    const { data, setData, put, processing, errors } = useForm({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company_name: client.company_name || '',
        address: client.address || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('clients.update', client.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Client - ${client.name}`} />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Clients', href: route('clients.index') },
                        { label: 'Edit Client' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Edit Client: {client.name}</h2>
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
                        isEdit={true}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

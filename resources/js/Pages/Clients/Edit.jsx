import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="h4 fw-semibold mb-0">Edit Client: {client.name}</h2>
                    <Link href={route('clients.index')} className="btn btn-outline-secondary btn-sm">
                        Back to Clients
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Client - ${client.name}`} />

            <div className="card shadow-sm border-0 mt-4">
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

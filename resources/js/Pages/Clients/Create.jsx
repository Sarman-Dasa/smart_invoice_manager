import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="h4 fw-semibold mb-0">Add New Client</h2>
                    <Link href={route('clients.index')} className="btn btn-outline-secondary btn-sm">
                        Back to Clients
                    </Link>
                </div>
            }
        >
            <Head title="Create Client" />

            <div className="card shadow-sm border-0 mt-4">
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

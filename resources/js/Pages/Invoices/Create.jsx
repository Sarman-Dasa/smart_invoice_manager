import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import InvoiceForm from '@/Components/Invoices/InvoiceForm';

export default function Create({ clients }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        amount: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('invoices.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Invoice" />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Invoices', href: route('invoices.index') },
                        { label: 'Create Invoice' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Create Invoice</h2>
                </div>
                <Link href={route('invoices.index')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left"></i> Back
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <InvoiceForm 
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        isEdit={false}
                        clients={clients}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

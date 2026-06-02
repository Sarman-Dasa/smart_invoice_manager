import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="h4 fw-semibold mb-0">Create Invoice</h2>
                    <Link href={route('invoices.index')} className="btn btn-outline-secondary btn-sm">
                        Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title="Create Invoice" />

            <div className="card shadow-sm border-0 mt-4">
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

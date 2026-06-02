import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import InvoiceForm from '@/Components/Invoices/InvoiceForm';

export default function Edit({ invoice, clients }) {
    // Helper to format date for input type="date"
    const formatDate = (dateString) => {
        if (!dateString) return '';
        // If it's a full ISO string from Laravel cast, split to get YYYY-MM-DD
        return dateString.split('T')[0];
    };

    const { data, setData, put, processing, errors } = useForm({
        client_id: invoice.client_id || '',
        issue_date: formatDate(invoice.issue_date),
        due_date: formatDate(invoice.due_date),
        amount: invoice.amount || '',
        notes: invoice.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('invoices.update', invoice.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Invoice - ${invoice.invoice_number}`} />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Invoices', href: route('invoices.index') },
                        { label: 'Edit Invoice' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Edit Invoice: {invoice.invoice_number}</h2>
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
                        isEdit={true}
                        clients={clients}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

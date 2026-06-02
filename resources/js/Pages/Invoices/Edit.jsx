import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
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
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="h4 fw-semibold mb-0">Edit Invoice: {invoice.invoice_number}</h2>
                    <Link href={route('invoices.index')} className="btn btn-outline-secondary btn-sm">
                        Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Invoice - ${invoice.invoice_number}`} />

            <div className="card shadow-sm border-0 mt-4">
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

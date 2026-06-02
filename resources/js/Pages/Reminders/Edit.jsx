import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ invoice, reminder }) {
    const { data, setData, put, processing, errors } = useForm({
        content: reminder.content || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('invoices.reminders.update', [invoice.id, reminder.id]));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Reminder - ${invoice.invoice_number}`} />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Invoices', href: route('invoices.index') },
                        { label: `Invoice ${invoice.invoice_number}`, href: route('invoices.show', invoice.id) || '#' },
                        { label: 'Reminders', href: route('invoices.reminders.index', invoice.id) },
                        { label: 'Edit Draft' }
                    ]} />
                    <h2 className="h3 fw-bold mb-1">Edit Reminder Draft</h2>
                    <p className="text-muted mb-0">Invoice: {invoice.invoice_number}</p>
                </div>
                <Link href={route('invoices.reminders.index', invoice.id)} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left"></i> Cancel
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="content" value="Reminder Email Content" />
                            <textarea
                                id="content"
                                name="content"
                                value={data.content}
                                className="form-control mt-1"
                                rows="10"
                                onChange={(e) => setData('content', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-1" />
                        </div>

                        <div className="d-flex justify-content-end">
                            <PrimaryButton disabled={processing}>
                                Save Changes
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

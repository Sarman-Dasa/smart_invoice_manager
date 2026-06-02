import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
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
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="h4 fw-semibold mb-0">Edit Reminder Draft</h2>
                        <small className="text-muted">Invoice: {invoice.invoice_number}</small>
                    </div>
                    <Link href={route('invoices.reminders.index', invoice.id)} className="btn btn-outline-secondary btn-sm">
                        Cancel
                    </Link>
                </div>
            }
        >
            <Head title={`Edit Reminder - ${invoice.invoice_number}`} />

            <div className="card shadow-sm border-0 mt-4">
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

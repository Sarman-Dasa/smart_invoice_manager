import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ invoice, reminders }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="h4 fw-semibold mb-0">Reminders History</h2>
                        <small className="text-muted">Invoice: {invoice.invoice_number}</small>
                    </div>
                    <div>
                        <Link href={route('invoices.index')} className="btn btn-outline-secondary btn-sm me-2">
                            Back to Invoices
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Reminders - ${invoice.invoice_number}`} />

            <div className="card shadow-sm border-0 mt-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Created At</th>
                                    <th>Preview</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reminders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">
                                            No reminder logs found for this invoice.
                                        </td>
                                    </tr>
                                ) : (
                                    reminders.data.map((reminder) => (
                                        <tr key={reminder.id}>
                                            <td>{new Date(reminder.created_at).toLocaleString()}</td>
                                            <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                                {reminder.content}
                                            </td>
                                            <td>
                                                {reminder.sent_at ? (
                                                    <span className="badge bg-success">
                                                        Sent ({new Date(reminder.sent_at).toLocaleString()})
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">Draft</span>
                                                )}
                                            </td>
                                            <td className="text-end">
                                                {!reminder.sent_at && (
                                                    <>
                                                        <Link 
                                                            href={route('invoices.reminders.send', [invoice.id, reminder.id])} 
                                                            method="post"
                                                            as="button"
                                                            className="btn btn-sm btn-success me-2"
                                                        >
                                                            Send Email
                                                        </Link>
                                                        <Link 
                                                            href={route('invoices.reminders.edit', [invoice.id, reminder.id])} 
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </>
                                                )}
                                                <Link 
                                                    href={route('invoices.reminders.destroy', [invoice.id, reminder.id])} 
                                                    method="delete"
                                                    as="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this reminder log?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination can be added here if needed */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

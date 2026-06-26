import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';

export default function Index({ invoice, reminders }) {
    const [confirmState, setConfirmState] = useState({ isOpen: false, reminderId: null });

    const handleDeleteClick = (reminderId) => {
        setConfirmState({ isOpen: true, reminderId });
    };

    const handleConfirmDelete = () => {
        if (confirmState.reminderId) {
            router.delete(route('invoices.reminders.destroy', [invoice.id, confirmState.reminderId]), {
                onFinish: () => setConfirmState({ isOpen: false, reminderId: null }),
            });
        }
    };
    return (
        <AuthenticatedLayout>
            <Head title={`Reminders - ${invoice.invoice_number}`} />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Invoices', href: route('invoices.index') },
                        { label: `Invoice ${invoice.invoice_number}`, href: route('invoices.edit', invoice.id) },
                        { label: 'Reminders' }
                    ]} />
                    <h2 className="h3 fw-bold mb-1">Reminders History</h2>
                    <p className="text-muted mb-0">Invoice: {invoice.invoice_number}</p>
                </div>
                <Link href={route('invoices.index')} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                    <i className="bi bi-arrow-left"></i> Back
                </Link>
            </div>

            <div className="card shadow-sm border-0">
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
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteClick(reminder.id)}
                                                >
                                                    Delete
                                                </button>
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

            <ConfirmModal
                show={confirmState.isOpen}
                title="Delete Reminder"
                message="Are you sure you want to delete this reminder log? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleConfirmDelete}
                onClose={() => setConfirmState({ isOpen: false, reminderId: null })}
            />
        </AuthenticatedLayout>
    );
}

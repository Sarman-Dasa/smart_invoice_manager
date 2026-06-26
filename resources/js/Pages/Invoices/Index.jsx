import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';
import GenerateReminderModal from '@/Components/Invoices/GenerateReminderModal';

export default function Index({ invoices, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [aiModalInvoice, setAiModalInvoice] = useState(null);
    const [confirmState, setConfirmState] = useState({ isOpen: false, action: null, invoiceId: null });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('invoices.index'), { search, status }, { preserveState: true, replace: true });
    };

    const clearStatusFilter = () => {
        setStatus('');
        router.get(route('invoices.index'), { search }, { preserveState: true, replace: true });
    };

    const handleConfirm = () => {
        if (confirmState.action === 'paid') {
            router.post(route('invoices.markAsPaid', confirmState.invoiceId), {}, {
                onFinish: () => setConfirmState({ isOpen: false, action: null, invoiceId: null })
            });
        } else if (confirmState.action === 'delete') {
            router.delete(route('invoices.destroy', confirmState.invoiceId), {
                onFinish: () => setConfirmState({ isOpen: false, action: null, invoiceId: null })
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            Pending: 'bg-warning text-dark',
            Paid: 'bg-success',
            Overdue: 'bg-danger',
        };
        return <span className={`badge ${badges[status] || 'bg-secondary'}`}>{status}</span>;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Invoices" />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Invoices' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Invoices</h2>
                </div>
                <Link href={route('invoices.create')} className="btn btn-primary d-flex align-items-center gap-2">
                    <i className="bi bi-file-earmark-plus"></i> Create Invoice
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    {status && (
                        <div className="mb-4 d-flex align-items-center bg-light p-3 rounded border">
                            <span className="me-3 text-muted fw-medium">Active Filter:</span>
                            <span className={`badge bg-${status === 'paid' ? 'success' : status === 'overdue' ? 'danger' : 'warning text-dark'} text-capitalize me-auto fs-6 px-3 py-2 shadow-sm`}>
                                {status} Invoices
                            </span>
                            <button onClick={clearStatusFilter} className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1">
                                <i className="bi bi-x-circle"></i> Clear Filter
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSearch} className="mb-4 d-flex" style={{ maxWidth: '400px' }}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search invoices or clients..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSearch('');
                                        router.get(route('invoices.index'), { search: '', status }, { preserveState: true, replace: true });
                                    }}
                                >
                                    <i className="bi bi-x"></i>
                                </button>
                            )}
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>
                    </form>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Client</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Reminders</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.data.map((invoice) => (
                                        <tr key={invoice.id}>
                                            <td className="fw-medium">
                                                <Link href={route('invoices.edit', invoice.id)} className="text-decoration-none">
                                                    {invoice.invoice_number}
                                                </Link>
                                            </td>
                                            <td>{invoice.client?.name || '-'}</td>
                                            <td>{formatDate(invoice.issue_date)}</td>
                                            <td>{formatDate(invoice.due_date)}</td>
                                            <td>${parseFloat(invoice.amount).toFixed(2)}</td>
                                            <td>{getStatusBadge(invoice.status)}</td>
                                            <td>
                                                <Link href={route('invoices.reminders.index', invoice.id)} className="text-decoration-none text-muted small">
                                                    {invoice.reminder_logs_count === 0 ? 'No Reminder' : `${invoice.reminder_logs_count} Reminder${invoice.reminder_logs_count > 1 ? 's' : ''}`}
                                                </Link>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end align-items-center gap-2">
                                                    {invoice.status === 'Overdue' && (
                                                        <button 
                                                            onClick={() => setAiModalInvoice(invoice)} 
                                                            className="btn btn-sm btn-dark shadow-sm"
                                                            title="Generate AI Draft"
                                                        >
                                                            Draft Reminder Email
                                                        </button>
                                                    )}
                                                    <div className="dropdown">
                                                        <button className="btn btn-sm btn-light border" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ padding: '0.25rem 0.4rem' }}>
                                                            <i className="bi bi-three-dots-vertical"></i>
                                                        </button>
                                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                                            {invoice.status !== 'Paid' && (
                                                                <li>
                                                                    <Link href={route('invoices.edit', invoice.id)} className="dropdown-item">
                                                                        <i className="bi bi-pencil me-2"></i> Edit
                                                                    </Link>
                                                                </li>
                                                            )}
                                                            {invoice.status !== 'Paid' && (
                                                                <li>
                                                                    <button className="dropdown-item text-success" onClick={() => setConfirmState({ isOpen: true, action: 'paid', invoiceId: invoice.id })}>
                                                                        <i className="bi bi-check-circle me-2"></i> Mark Paid
                                                                    </button>
                                                                </li>
                                                            )}
                                                            <li>
                                                                <Link href={route('invoices.reminders.index', invoice.id)} className="dropdown-item">
                                                                    <i className="bi bi-clock-history me-2"></i> Reminder History
                                                                </Link>
                                                            </li>
                                                            {invoice.status !== 'Paid' && (
                                                                <>
                                                                    <li><hr className="dropdown-divider" /></li>
                                                                    <li>
                                                                        <button className="dropdown-item text-danger" onClick={() => setConfirmState({ isOpen: true, action: 'delete', invoiceId: invoice.id })}>
                                                                            <i className="bi bi-trash me-2"></i> Delete
                                                                        </button>
                                                                    </li>
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {invoices.links && invoices.links.length > 3 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {invoices.links.map((link, key) => (
                                    <li 
                                        key={key} 
                                        className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                                    >
                                        <Link 
                                            className="page-link" 
                                            href={link.url || '#'}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>

            {aiModalInvoice && (
                <GenerateReminderModal
                    invoice={aiModalInvoice}
                    show={!!aiModalInvoice}
                    onClose={() => setAiModalInvoice(null)}
                />
            )}

            <ConfirmModal
                show={confirmState.isOpen}
                title={confirmState.action === 'paid' ? "Mark as Paid" : "Delete Invoice"}
                message={confirmState.action === 'paid' 
                    ? "Are you sure you want to mark this invoice as paid?" 
                    : "Are you sure you want to delete this invoice? This action cannot be undone."}
                confirmText={confirmState.action === 'paid' ? "Mark Paid" : "Delete"}
                confirmVariant={confirmState.action === 'paid' ? "success" : "danger"}
                onConfirm={handleConfirm}
                onClose={() => setConfirmState({ isOpen: false, action: null, invoiceId: null })}
            />
        </AuthenticatedLayout>
    );
}

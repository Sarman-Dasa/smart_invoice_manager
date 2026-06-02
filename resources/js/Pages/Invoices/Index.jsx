import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import { useState } from 'react';
import GenerateReminderModal from '@/Components/Invoices/GenerateReminderModal';

export default function Index({ invoices, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [aiModalInvoice, setAiModalInvoice] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('invoices.index'), { search }, { preserveState: true, replace: true });
    };

    const markAsPaid = (invoiceId) => {
        if (confirm('Are you sure you want to mark this invoice as paid?')) {
            router.post(route('invoices.markAsPaid', invoiceId));
        }
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
                    <form onSubmit={handleSearch} className="mb-4 d-flex" style={{ maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search invoices or clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-outline-secondary">Search</button>
                    </form>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Invoice #</th>
                                    <th>Client</th>
                                    <th>Issue Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
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
                                            <td className="fw-medium">{invoice.invoice_number}</td>
                                            <td>{invoice.client?.name || '-'}</td>
                                            <td>{invoice.issue_date}</td>
                                            <td>${parseFloat(invoice.amount).toFixed(2)}</td>
                                            <td>{getStatusBadge(invoice.status)}</td>
                                            <td className="text-end">
                                                {invoice.status !== 'Paid' && (
                                                    <button 
                                                        onClick={() => markAsPaid(invoice.id)} 
                                                        className="btn btn-sm btn-outline-success me-2"
                                                    >
                                                        Mark Paid
                                                    </button>
                                                )}
                                                {invoice.status !== 'Paid' && (
                                                    <button 
                                                        onClick={() => setAiModalInvoice(invoice)} 
                                                        className="btn btn-sm btn-dark me-2 shadow-sm"
                                                    >
                                                        ✨ AI Draft
                                                    </button>
                                                )}
                                                <Link 
                                                    href={route('invoices.reminders.index', invoice.id)} 
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                >
                                                    Reminders
                                                </Link>
                                                <Link 
                                                    href={route('invoices.edit', invoice.id)} 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                >
                                                    Edit
                                                </Link>
                                                <Link 
                                                    href={route('invoices.destroy', invoice.id)} 
                                                    method="delete"
                                                    as="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this invoice?')) {
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
        </AuthenticatedLayout>
    );
}

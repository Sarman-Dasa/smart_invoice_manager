import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import DashboardCard from '@/Components/DashboardCard';

export default function Dashboard({ stats, recentInvoices, recentReminders }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
                <div>
                    <h2 className="h3 fw-bold mb-1">Dashboard</h2>
                    <p className="text-muted mb-0">Overview of your invoicing operations.</p>
                </div>
                <div className="d-flex flex-wrap gap-2">
                    <Link href={route('clients.create')} className="btn btn-outline-primary d-flex align-items-center gap-2">
                        <i className="bi bi-person-plus"></i>
                        <span className="d-none d-sm-inline">New Client</span>
                    </Link>
                    <Link href={route('invoices.create')} className="btn btn-primary d-flex align-items-center gap-2">
                        <i className="bi bi-file-earmark-plus"></i>
                        <span className="d-none d-sm-inline">Create Invoice</span>
                    </Link>
                    <Link href={route('invoices.index')} className="btn btn-dark d-flex align-items-center gap-2 shadow-sm">
                        <i className="bi bi-robot"></i>
                        <span className="d-none d-sm-inline">Generate Reminder</span>
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-5 g-4 mb-5">
                <div className="col">
                    <DashboardCard 
                        title="Total Clients" 
                        value={stats.clients.total} 
                        icon="bi-people"
                        linkHref={route('clients.index')}
                    />
                </div>
                <div className="col">
                    <DashboardCard 
                        title="Total Invoices" 
                        value={stats.invoices.total} 
                        icon="bi-receipt"
                        color="info"
                        linkHref={route('invoices.index')}
                    />
                </div>
                <div className="col">
                    <DashboardCard 
                        title="Pending Invoices" 
                        value={stats.invoices.pending} 
                        icon="bi-hourglass-split"
                        color="warning"
                        linkHref={route('invoices.index', { status: 'pending' })}
                    />
                </div>
                <div className="col">
                    <DashboardCard 
                        title="Paid Invoices" 
                        value={stats.invoices.paid} 
                        icon="bi-check-circle"
                        color="success"
                        linkHref={route('invoices.index', { status: 'paid' })}
                    />
                </div>
                <div className="col">
                    <DashboardCard 
                        title="Overdue Invoices" 
                        value={stats.invoices.overdue} 
                        icon="bi-exclamation-triangle"
                        color="danger"
                        isDanger={true}
                        highlightMessage={stats.invoices.overdue > 0 ? 'Requires attention' : null}
                        linkHref={route('invoices.index', { status: 'overdue' })}
                    />
                </div>
            </div>

            {/* Data Tables */}
            <div className="row g-4">
                {/* Recent Invoices */}
                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Recent Invoices</h5>
                            <Link href={route('invoices.index')} className="btn btn-sm btn-light">View All</Link>
                        </div>
                        <div className="card-body p-0">
                            {recentInvoices.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="px-3 border-0">Invoice #</th>
                                                <th className="border-0">Client</th>
                                                <th className="border-0">Amount</th>
                                                <th className="border-0">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentInvoices.map((invoice) => (
                                                <tr key={invoice.id}>
                                                    <td className="px-3 fw-medium">{invoice.invoice_number}</td>
                                                    <td>{invoice.client.company_name}</td>
                                                    <td>${parseFloat(invoice.amount).toFixed(2)}</td>
                                                    <td>
                                                        <span className={`badge bg-${invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning text-dark'}`}>
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted">
                                    <i className="bi bi-inbox fs-2 mb-2 d-block text-secondary"></i>
                                    No invoices created yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent AI Activity */}
                <div className="col-12 col-xl-6">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Recent AI Reminders</h5>
                            <Link href={route('reminders.index')} className="btn btn-sm btn-light">View History</Link>
                        </div>
                        <div className="card-body p-0">
                            {recentReminders.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="px-3 border-0">Invoice</th>
                                                <th className="border-0">Generated</th>
                                                <th className="border-0">Status</th>
                                                <th className="px-3 border-0 text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentReminders.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="px-3">
                                                        <Link href={route('invoices.edit', log.invoice_id)} className="text-decoration-none fw-medium">
                                                            {log.invoice.invoice_number}
                                                        </Link>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {new Date(log.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {log.sent_at ? (
                                                            <span className="badge bg-success bg-opacity-10 text-success border border-success">Sent</span>
                                                        ) : (
                                                            <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">Draft</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 text-end">
                                                        <Link href={route('invoices.reminders.edit', [log.invoice_id, log.id])} className="btn btn-sm btn-outline-primary">
                                                            Review
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted">
                                    <i className="bi bi-robot fs-2 mb-2 d-block text-secondary"></i>
                                    No AI reminders generated recently.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

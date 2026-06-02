import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';

export default function GlobalIndex({ reminders }) {
    return (
        <AuthenticatedLayout>
            <Head title="Reminder History" />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Reminder History' }
                    ]} />
                    <h2 className="h3 fw-bold mb-1">Global Reminder History</h2>
                    <p className="text-muted mb-0">Overview of all generated AI reminders.</p>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-3 border-0">Generated On</th>
                                    <th className="border-0">Invoice #</th>
                                    <th className="border-0">Client</th>
                                    <th className="border-0">Status</th>
                                    <th className="px-3 border-0 text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reminders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <i className="bi bi-clock-history fs-1 d-block mb-3 text-secondary opacity-50"></i>
                                            No reminder logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    reminders.data.map((reminder) => (
                                        <tr key={reminder.id}>
                                            <td className="px-3">{new Date(reminder.created_at).toLocaleString()}</td>
                                            <td>
                                                <Link href={route('invoices.show', reminder.invoice.id)} className="text-decoration-none fw-medium">
                                                    {reminder.invoice.invoice_number}
                                                </Link>
                                            </td>
                                            <td>{reminder.invoice.client?.company_name || reminder.invoice.client?.name || '-'}</td>
                                            <td>
                                                {reminder.sent_at ? (
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success">
                                                        Sent ({new Date(reminder.sent_at).toLocaleDateString()})
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">Draft</span>
                                                )}
                                            </td>
                                            <td className="px-3 text-end">
                                                {!reminder.sent_at && (
                                                    <>
                                                        <Link 
                                                            href={route('invoices.reminders.send', [reminder.invoice.id, reminder.id])} 
                                                            method="post"
                                                            as="button"
                                                            className="btn btn-sm btn-success me-2"
                                                        >
                                                            Send Email
                                                        </Link>
                                                        <Link 
                                                            href={route('invoices.reminders.edit', [reminder.invoice.id, reminder.id])} 
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </>
                                                )}
                                                <Link 
                                                    href={route('invoices.reminders.destroy', [reminder.invoice.id, reminder.id])} 
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
                    
                    {reminders.links && reminders.links.length > 3 && (
                        <div className="p-3 border-top">
                            <nav>
                                <ul className="pagination justify-content-center mb-0">
                                    {reminders.links.map((link, key) => (
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
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

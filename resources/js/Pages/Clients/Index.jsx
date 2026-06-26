import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import ConfirmModal from '@/Components/ConfirmModal';
import { useState } from 'react';

export default function Index({ clients, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [confirmState, setConfirmState] = useState({ isOpen: false, clientId: null });

    const handleDeleteClick = (clientId) => {
        setConfirmState({ isOpen: true, clientId });
    };

    const handleConfirmDelete = () => {
        if (confirmState.clientId) {
            router.delete(route('clients.destroy', confirmState.clientId), {
                onFinish: () => setConfirmState({ isOpen: false, clientId: null }),
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('clients.index'), { search }, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Clients" />

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <Breadcrumb items={[
                        { label: 'Dashboard', href: route('dashboard') },
                        { label: 'Clients' }
                    ]} />
                    <h2 className="h3 fw-bold mb-0">Clients</h2>
                </div>
                <Link href={route('clients.create')} className="btn btn-primary d-flex align-items-center gap-2">
                    <i className="bi bi-person-plus"></i> Add Client
                </Link>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="mb-4 d-flex" style={{ maxWidth: '400px' }}>
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-outline-secondary">Search</button>
                    </form>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Name</th>
                                    <th>Company</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No clients found.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.data.map((client) => (
                                        <tr key={client.id}>
                                            <td className="fw-medium">{client.name}</td>
                                            <td>{client.company_name || '-'}</td>
                                            <td>{client.email || '-'}</td>
                                            <td>{client.phone || '-'}</td>
                                            <td className="text-end">
                                                <Link 
                                                    href={route('clients.edit', client.id)} 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteClick(client.id)}
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

                    {/* Basic Pagination (Bootstrap) */}
                    {clients.links && clients.links.length > 3 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {clients.links.map((link, key) => (
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
            <ConfirmModal
                show={confirmState.isOpen}
                title="Delete Client"
                message="Are you sure you want to delete this client? This action cannot be undone."
                confirmText="Delete"
                confirmVariant="danger"
                onConfirm={handleConfirmDelete}
                onClose={() => setConfirmState({ isOpen: false, clientId: null })}
            />
        </AuthenticatedLayout>
    );
}

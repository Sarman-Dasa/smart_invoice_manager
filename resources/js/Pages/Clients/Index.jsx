import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import { useState } from 'react';

export default function Index({ clients, filters }) {
    const [search, setSearch] = useState(filters.search || '');

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
                                                <Link 
                                                    href={route('clients.destroy', client.id)} 
                                                    method="delete"
                                                    as="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={(e) => {
                                                        if (!confirm('Are you sure you want to delete this client?')) {
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
        </AuthenticatedLayout>
    );
}

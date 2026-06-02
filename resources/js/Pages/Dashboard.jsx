import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="h4 fw-semibold mb-0">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <div className="row g-4 mt-2">
                {/* Clients Card */}
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted text-uppercase fw-semibold mb-2">Total Clients</h6>
                            <h2 className="display-6 fw-bold mb-3">{stats.clients.total}</h2>
                            <Link href={route('clients.index')} className="text-decoration-none btn btn-sm btn-outline-primary">
                                View Clients &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Invoices */}
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted text-uppercase fw-semibold mb-2">Total Invoices</h6>
                            <h2 className="display-6 fw-bold mb-3">{stats.invoices.total}</h2>
                            <Link href={route('invoices.index')} className="text-decoration-none btn btn-sm btn-outline-primary">
                                View Invoices &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Pending Invoices */}
                <div className="col-12 col-md-4 col-xl-4">
                    <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
                        <div className="card-body">
                            <h6 className="text-muted text-uppercase fw-semibold mb-2">Pending Invoices</h6>
                            <h2 className="display-6 fw-bold text-warning mb-0">{stats.invoices.pending}</h2>
                        </div>
                    </div>
                </div>

                {/* Overdue Invoices */}
                <div className="col-12 col-md-4 col-xl-6">
                    <div className="card shadow-sm border-0 border-start border-danger border-4 h-100 bg-danger bg-opacity-10">
                        <div className="card-body">
                            <h6 className="text-danger text-uppercase fw-semibold mb-2">Overdue Invoices</h6>
                            <h2 className="display-6 fw-bold text-danger mb-0">{stats.invoices.overdue}</h2>
                            {stats.invoices.overdue > 0 && (
                                <small className="text-danger d-block mt-2 fw-medium">Requires immediate attention!</small>
                            )}
                        </div>
                    </div>
                </div>

                {/* Paid Invoices */}
                <div className="col-12 col-md-4 col-xl-6">
                    <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
                        <div className="card-body">
                            <h6 className="text-muted text-uppercase fw-semibold mb-2">Paid Invoices</h6>
                            <h2 className="display-6 fw-bold text-success mb-0">{stats.invoices.paid}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

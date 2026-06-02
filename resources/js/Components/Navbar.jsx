import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Navbar() {
    const { url, props } = usePage();
    const user = props.auth.user;

    const navLinks = [
        { name: 'Dashboard', href: route('dashboard'), active: url === '/dashboard' },
        { name: 'Clients', href: route('clients.index'), active: url.startsWith('/clients') },
        { name: 'Invoices', href: route('invoices.index'), active: url.startsWith('/invoices') && !url.includes('/reminders') },
        { name: 'Reminder History', href: route('reminders.index'), active: url.startsWith('/reminders') || url.includes('/reminders') },
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
            <div className="container">
                {/* Brand Logo & Name */}
                <Link href={route('dashboard')} className="navbar-brand d-flex align-items-center gap-2 me-4">
                    <ApplicationLogo className="text-primary" style={{ width: '32px', height: '32px' }} />
                    <span className="fw-bold fs-5 text-white">Smart Invoice</span>
                </Link>

                {/* Mobile Toggle Button */}
                <button 
                    className="navbar-toggler border-0" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#mainNavbarCollapse" 
                    aria-controls="mainNavbarCollapse" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links & User Menu */}
                <div className="collapse navbar-collapse" id="mainNavbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {navLinks.map((link, index) => (
                            <li className="nav-item me-1" key={index}>
                                <Link 
                                    href={link.href} 
                                    className={`nav-link px-3 rounded ${link.active ? 'active bg-primary bg-opacity-25 fw-medium text-white' : 'text-white-50 hover-text-white'}`}
                                    style={{ transition: 'all 0.2s ease' }}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex align-items-center mt-3 mt-lg-0">
                        <div className="dropdown">
                            <button 
                                className="btn btn-dark dropdown-toggle border-0 fw-medium d-flex align-items-center gap-2" 
                                type="button" 
                                id="userDropdown" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false"
                            >
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span>{user.name}</span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
                                <li><h6 className="dropdown-header text-truncate" style={{ maxWidth: '200px' }}>{user.email}</h6></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <Link className="dropdown-item py-2" href={route('profile.edit')}>
                                        <i className="bi bi-person me-2 text-muted"></i> Profile Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item py-2 text-danger" href={route('logout')} method="post" as="button">
                                        <i className="bi bi-box-arrow-right me-2"></i> Log Out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

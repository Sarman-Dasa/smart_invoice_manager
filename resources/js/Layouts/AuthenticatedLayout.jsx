import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="min-vh-100 bg-light">
            <nav className="navbar navbar-expand-lg navbar-white bg-white border-bottom shadow-sm">
                <div className="container">
                    <Link href={route('dashboard')} className="navbar-brand d-flex align-items-center">
                        <ApplicationLogo className="text-primary me-2" style={{ width: '36px', height: '36px' }} />
                        <span className="fw-bold">Smart Invoice Manager</span>
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link 
                                    href={route('dashboard')} 
                                    className={`nav-link ${route().current('dashboard') ? 'active fw-bold' : ''}`}
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </ul>

                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {user.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link href={route('profile.edit')} className="dropdown-item">
                                            Profile
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link href={route('logout')} method="post" as="button" className="dropdown-item">
                                            Log Out
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow-sm mb-4 py-3">
                    <div className="container">
                        {header}
                    </div>
                </header>
            )}

            <main className="container pb-5">
                {children}
            </main>
        </div>
    );
}

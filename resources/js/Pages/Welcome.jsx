import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="d-flex flex-column min-vh-100 bg-light">
                {/* Navbar */}
                <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                    <div className="container">
                        <a className="navbar-brand fw-bold text-primary" href="#">
                            Smart Invoice Manager
                        </a>
                        <div className="d-flex ms-auto">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="btn btn-outline-primary"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="btn btn-outline-secondary me-2"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="btn btn-primary"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="flex-grow-1 d-flex align-items-center justify-content-center text-center p-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <h1 className="display-4 fw-bold mb-4">
                                    Manage Your Invoices Intelligently
                                </h1>
                                <p className="lead text-muted mb-5">
                                    A robust, scalable platform to create, send, and track invoices with AI-powered features.
                                </p>
                                
                                <div className="d-flex justify-content-center gap-3">
                                    {auth.user ? (
                                        <Link href={route('dashboard')} className="btn btn-primary btn-lg">
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <Link href={route('register')} className="btn btn-primary btn-lg">
                                            Get Started Now
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white py-4 mt-auto border-top">
                    <div className="container text-center text-muted">
                        <small>
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </small>
                    </div>
                </footer>
            </div>
        </>
    );
}

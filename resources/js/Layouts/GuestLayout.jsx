import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
            <div className="mb-4">
                <Link href="/">
                    <ApplicationLogo className="text-primary" style={{ width: '80px', height: '80px' }} />
                </Link>
            </div>

            <div className="card shadow-sm border-0 w-100" style={{ maxWidth: '450px' }}>
                <div className="card-body p-4 p-sm-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

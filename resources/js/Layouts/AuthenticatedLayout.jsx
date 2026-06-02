import Navbar from '@/Components/Navbar';

export default function AuthenticatedLayout({ children }) {
    return (
        <div className="min-vh-100 bg-light d-flex flex-column">
            <Navbar />
            
            <main className="flex-grow-1 container py-4">
                {children}
            </main>
            
            <footer className="mt-auto py-3 bg-white border-top text-center text-muted small">
                <div className="container">
                    &copy; {new Date().getFullYear()} Smart Invoice Manager. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

import { Link } from '@inertiajs/react';

export default function Breadcrumb({ items }) {
    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb mb-0 bg-transparent p-0">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    if (isLast) {
                        return (
                            <li key={index} className="breadcrumb-item active text-dark fw-medium" aria-current="page">
                                {item.label}
                            </li>
                        );
                    }

                    return (
                        <li key={index} className="breadcrumb-item">
                            <Link href={item.href} className="text-decoration-none text-muted">
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

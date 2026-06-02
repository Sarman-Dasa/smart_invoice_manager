import { Link } from '@inertiajs/react';

export default function DashboardCard({ title, value, icon, color = 'primary', linkText, linkHref, highlightMessage, isDanger = false }) {
    return (
        <div className={`card shadow-sm border-0 border-start border-${color} border-4 h-100 ${isDanger ? 'bg-danger bg-opacity-10' : ''}`}>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className={`text-uppercase fw-semibold mb-0 ${isDanger ? 'text-danger' : 'text-muted'}`}>
                        {title}
                    </h6>
                    {icon && (
                        <div className={`text-${color} bg-${color} bg-opacity-10 rounded p-2 d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
                            <i className={`bi ${icon} fs-5`}></i>
                        </div>
                    )}
                </div>
                
                <h2 className={`display-6 fw-bold mb-1 ${isDanger ? 'text-danger' : `text-${color}`}`}>
                    {value}
                </h2>
                
                {highlightMessage && (
                    <small className={`${isDanger ? 'text-danger' : `text-${color}`} d-block mt-1 fw-medium`}>
                        {highlightMessage}
                    </small>
                )}

                <div className="mt-auto pt-3">
                    {linkHref && linkText ? (
                        <Link href={linkHref} className={`text-decoration-none btn btn-sm btn-outline-${color} w-100`}>
                            {linkText} &rarr;
                        </Link>
                    ) : (
                        <div style={{ height: '31px' }}></div> /* Spacer to match button height */
                    )}
                </div>
            </div>
        </div>
    );
}

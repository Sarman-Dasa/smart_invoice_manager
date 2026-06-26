import { Link } from '@inertiajs/react';

export default function DashboardCard({ title, value, icon, color = 'primary', linkHref, highlightMessage, isDanger = false }) {
    const CardContent = () => (
        <div className={`card shadow-sm border-0 border-start border-${color} border-4 h-100 position-relative overflow-hidden ${isDanger ? 'bg-danger bg-opacity-10' : 'bg-white'} card-hover-effect`}>
            {icon && (
                <i className={`bi ${icon} position-absolute text-${color}`} 
                   style={{ 
                       bottom: '-10px', 
                       right: '10px', 
                       fontSize: '5rem', 
                       opacity: '0.1', 
                       zIndex: '0' 
                   }}>
                </i>
            )}
            
            <div className="card-body position-relative z-1 d-flex flex-column p-3 p-xl-4">
                <h6 className={`text-uppercase fw-semibold mb-2 ${isDanger ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                    {title}
                </h6>
                
                <h2 className={`display-5 fw-bold mb-0 ${isDanger ? 'text-danger' : `text-${color}`}`} style={{ lineHeight: '1' }}>
                    {value}
                </h2>
                
                {highlightMessage ? (
                    <small className={`${isDanger ? 'text-danger' : `text-${color}`} d-block mt-2 fw-medium`}>
                        {highlightMessage}
                    </small>
                ) : (
                    <div className="mt-2" style={{ height: '21px' }}>
                        {linkHref && (
                            <span className={`text-${color} small fw-medium`}>
                                View Details &rarr;
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    if (linkHref) {
        return (
            <Link href={linkHref} className="text-decoration-none d-block h-100">
                <CardContent />
            </Link>
        );
    }

    return <CardContent />;
}

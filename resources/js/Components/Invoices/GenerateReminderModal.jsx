import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function GenerateReminderModal({ invoice, show, onClose }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [streamedContent, setStreamedContent] = useState('');
    const [error, setError] = useState('');
    const [eventSource, setEventSource] = useState(null);
    const textareaRef = useRef(null);
    const initialized = useRef(false);

    useEffect(() => {
        if (show && !initialized.current) {
            initialized.current = true;
            startGeneration();
        } else if (!show) {
            initialized.current = false;
        }
    }, [show]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [streamedContent, isGenerating]);

    const startGeneration = () => {
        setIsGenerating(true);
        setStreamedContent('');
        setError('');

        const url = route('ai.stream-reminder', invoice.id);
        const source = new EventSource(url);
        
        setEventSource(source);

        source.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.text) {
                setStreamedContent((prev) => prev + data.text);
            }
        };

        source.addEventListener('end', () => {
            source.close();
            setIsGenerating(false);
        });

        source.addEventListener('error', (event) => {
            source.close();
            setIsGenerating(false);
            try {
                const data = JSON.parse(event.data);
                setError(data.message || 'An error occurred during generation.');
            } catch (e) {
                setError('Connection lost or error occurred.');
            }
        });
    };

    const handleSave = (sendEmail = false) => {
        router.post(route('invoices.reminders.store', invoice.id), {
            content: streamedContent,
            send_email: sendEmail
        }, {
            onSuccess: () => {
                handleClose();
            }
        });
    };

    const handleClose = () => {
        if (eventSource) {
            eventSource.close();
        }
        setIsGenerating(false);
        setStreamedContent('');
        setError('');
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow">
                    <div className="modal-header border-bottom-0">
                        <h5 className="modal-title fw-bold">
                            ✨ AI Reminder Generator
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-4">
                            <span className="text-muted">Invoice: </span>
                            <span className="fw-bold">{invoice?.invoice_number}</span>
                        </div>

                        {error && (
                            <div className="alert alert-danger d-flex align-items-center p-3 rounded mb-4 shadow-sm" role="alert">
                                <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                                <div>
                                    <h6 className="alert-heading fw-bold mb-1">AI Generation Error</h6>
                                    <span className="text-sm">{error}</span>
                                </div>
                            </div>
                        )}

                        {isGenerating && !streamedContent && !error ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <h5 className="fw-bold">Generating AI reminder...</h5>
                                <p className="text-muted">Google Gemini is creating a personalized payment reminder.</p>
                            </div>
                        ) : (
                            (streamedContent || isGenerating) && (
                                <div className="form-group">
                                    <label className="form-label fw-bold">
                                        Generated Draft {isGenerating && <span className="badge bg-primary ms-2">Streaming...</span>}
                                    </label>
                                    <textarea
                                        ref={textareaRef}
                                        className="form-control"
                                        rows="12"
                                        value={streamedContent}
                                        readOnly={isGenerating}
                                        onChange={(e) => setStreamedContent(e.target.value)}
                                        style={{ resize: 'none' }}
                                    ></textarea>
                                </div>
                            )
                        )}
                    </div>
                    <div className="modal-footer border-top-0 bg-light rounded-bottom">
                        <SecondaryButton onClick={handleClose}>
                            Close
                        </SecondaryButton>
                        <button 
                            className="btn btn-primary" 
                            onClick={() => handleSave(false)}
                            disabled={isGenerating || !streamedContent}
                        >
                            Save Reminder
                        </button>
                        <button 
                            className="btn btn-success" 
                            onClick={() => handleSave(true)}
                            disabled={isGenerating || !streamedContent}
                        >
                            Save & Send Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

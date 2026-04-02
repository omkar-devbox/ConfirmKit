import { CSSProperties } from 'react';
import { ConfirmStyles } from '../types/react.types';

export const defaultStyles: Required<ConfirmStyles> = {
    overlay: {
        position: 'fixed',
        inset: '0',
        backgroundColor: 'rgba(17, 24, 39, 0.35)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999',
        pointerEvents: 'auto',
    },

    container: {
        backgroundColor: '#ffffff',
        padding: '28px 24px',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08), 0 20px 48px rgba(0,0,0,0.12)',
    },

    title: {
        margin: '0 0 8px',
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#111827',
    },

    description: {
        margin: '0 0 24px',
        fontSize: '0.95rem',
        color: '#6b7280',
        lineHeight: '1.5',
    },

    actions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: '12px'
    },

    confirmButton: {
        background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
        color: '#fff',
        boxShadow: '0 6px 14px rgba(37, 99, 235, 0.35)',
    },

    cancelButton: {
        backgroundColor: '#e5edf8',
        color: '#3b82f6',
    },
    icon: {}
};

export const BUILT_IN_PRESETS: Record<string, Partial<ConfirmStyles>> = {
    success: {
        confirmButton: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 6px 14px rgba(16, 185, 129, 0.35)',
        },
        icon: { color: '#10b981' }
    },
    error: {
        confirmButton: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 6px 14px rgba(239, 68, 68, 0.35)',
        },
        icon: { color: '#ef4444' }
    },
    warning: {
        confirmButton: {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 6px 14px rgba(245, 158, 11, 0.35)',
        },
        icon: { color: '#f59e0b' }
    },
    info: {
        confirmButton: {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 6px 14px rgba(59, 130, 246, 0.35)',
        },
        icon: { color: '#3b82f6' }
    }
};

export const defaultCSS = `
.ck-btn-confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);
}

.ck-btn-cancel:hover {
    background: #dbeafe;
}

.ck-icon, .ck-icon-custom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 16px;
    animation: ck-scale-up 0.3s ease-out;
}

@keyframes ck-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes ck-scale-up {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.ck-overlay {
    animation: ck-fade-in 0.2s ease-out;
}

.ck-container {
    animation: ck-scale-up 0.25s ease;
}

.ck-btn {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.ck-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
`;

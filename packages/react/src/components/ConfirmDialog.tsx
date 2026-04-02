import React, { useEffect, useRef } from 'react';
import { ReactConfirmState } from '../types/react.types';
import { defaultStyles, BUILT_IN_PRESETS, defaultCSS } from '../styles/defaultStyles';
import { ReactPortal } from '../adapter/ReactPortal';

export interface ConfirmDialogProps {
    state: ReactConfirmState<any, any, any>;
    confirmAction: () => void;
    cancelAction: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ state, confirmAction, cancelAction }) => {
    const { options, loading, presets } = state;
    const { 
        title, 
        message, 
        description, 
        confirmText, 
        cancelText, 
        styles: customStyles, 
        variant, 
        icon: iconOption,
        closeOnEsc
    } = options;

    // Resolve preset
    const preset = (variant && (presets?.[variant] || BUILT_IN_PRESETS[variant])) || {};

    // Combine styles: default < preset < custom
    const combine = <T extends Record<string, any>>(base: T, p?: Partial<T>, c?: Partial<T>): T => ({
        ...base,
        ...(p || {}),
        ...(c || {})
    });

    const styles = {
        overlay: combine(defaultStyles.overlay, preset.overlay, customStyles?.overlay),
        container: combine(defaultStyles.container, preset.container, customStyles?.container),
        title: combine(defaultStyles.title, preset.title, customStyles?.title),
        description: combine(defaultStyles.description, preset.description, customStyles?.description),
        actions: combine(defaultStyles.actions, preset.actions, customStyles?.actions),
        confirmButton: combine(defaultStyles.confirmButton, preset.confirmButton, customStyles?.confirmButton),
        cancelButton: combine(defaultStyles.cancelButton, preset.cancelButton, customStyles?.cancelButton),
        icon: combine(defaultStyles.icon, preset.icon, customStyles?.icon),
    };

    // Render message (handle alias)
    const finalMessage = message || description || '';

    // Icon resolution
    const renderIcon = () => {
        if (!iconOption) return null;

        if (React.isValidElement(iconOption)) {
            return <div style={styles.icon}>{iconOption}</div>;
        }

        // Built-in icon
        const iconType = typeof iconOption === 'string' ? iconOption : variant;
        if (iconType && ['success', 'error', 'warning', 'info'].includes(iconType)) {
            return (
                <div style={styles.icon} className="ck-icon">
                    <BuiltInIcon type={iconType as any} />
                </div>
            );
        }

        return null;
    };

    return (
        <ReactPortal>
            <style dangerouslySetInnerHTML={{ __html: defaultCSS }} />
            <div 
                className="ck-overlay" 
                style={styles.overlay}
                onClick={(e) => {
                    if (e.target === e.currentTarget && closeOnEsc !== false) {
                        cancelAction();
                    }
                }}
            >
                <div 
                    className="ck-container" 
                    style={styles.container}
                    role="dialog"
                    aria-modal="true"
                >
                    {renderIcon()}
                    
                    {title && (
                        <h2 style={styles.title} className="ck-title">
                            {typeof title === 'function' ? title(state.context) : title}
                        </h2>
                    )}
                    
                    {finalMessage && (
                        <div style={styles.description} className="ck-description">
                            {typeof finalMessage === 'function' ? finalMessage(state.context) : finalMessage}
                        </div>
                    )}

                    <div style={styles.actions} className="ck-actions">
                        <button 
                            type="button" 
                            className="ck-btn ck-btn-confirm" 
                            style={styles.confirmButton}
                            onClick={confirmAction}
                            disabled={loading}
                        >
                            {loading ? '...' : (confirmText || 'OK')}
                        </button>
                        
                        <button 
                            type="button" 
                            className="ck-btn ck-btn-cancel" 
                            style={styles.cancelButton}
                            onClick={cancelAction}
                            disabled={loading}
                        >
                            {cancelText || 'Cancel'}
                        </button>
                    </div>
                </div>
            </div>
        </ReactPortal>
    );
};

const BuiltInIcon: React.FC<{ type: 'success' | 'error' | 'warning' | 'info' }> = ({ type }) => {
    switch (type) {
        case 'success':
            return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
        case 'error':
            return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
        case 'warning':
            return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
        case 'info':
            return <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
        default:
            return null;
    }
};

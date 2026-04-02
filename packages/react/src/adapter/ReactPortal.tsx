import React from 'react';
import { createPortal } from 'react-dom';

export interface ReactPortalProps {
    children: React.ReactNode;
    container?: HTMLElement;
}

/**
 * Handles rendering the dialog components into a portal.
 * Defaults to document.body if no container is provided.
 */
export const ReactPortal: React.FC<ReactPortalProps> = ({ children, container }) => {
    // If we're on the server, we don't render portals
    if (typeof window === 'undefined') return null;

    const mountNode = container || document.body;
    return createPortal(children, mountNode);
};

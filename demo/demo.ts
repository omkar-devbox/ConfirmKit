import { confirm, createConfirmKit } from '@confirmkit/vanilla'

// Demonstrate Custom Presets at Factory Level
const customConfirm = createConfirmKit({
    presets: {
        danger: {
            container: { border: '2px solid #ef4444' },
            confirmButton: { background: '#dc2626', color: '#fff' },
            icon: { color: '#ef4444' }
        }
    }
})

const logEl = document.getElementById('log')!

function log(message: string, type: 'info' | 'success' | 'cancel' = 'info') {
    const entry = document.createElement('div')
    entry.className = `log-entry log-${type}`

    const time = document.createElement('span')
    time.className = 'log-time'
    time.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })

    const msg = document.createElement('span')
    msg.className = 'log-msg'
    msg.textContent = message

    entry.appendChild(time)
    entry.appendChild(msg)

    logEl.prepend(entry)
}

// 1. Default Confirm
document.getElementById('btn-default')?.addEventListener('click', async () => {
    log('Opening default confirmation...', 'info')
    const result = await confirm({
        title: 'Delete Resources?',
        description: 'This will permanently remove 12 selected items from your workspace.',
        confirmText: 'Delete Items',
        cancelText: 'Keep them'
    })
    log(`Decision: ${result ? 'PROCEEDED' : 'CANCELLED'}`, result ? 'success' : 'cancel')
})

// 2. Custom Styled Confirm (Glassmorphism)
document.getElementById('btn-custom')?.addEventListener('click', async () => {
    log('Opening glassmorphism demo...', 'info')
    const result = await confirm({
        title: 'Glass UI',
        description: 'Advanced backdrop-filter effects with high-performance CSS blur.',
        confirmText: 'Impressive',
        cancelText: 'Close',
        styles: {
            overlay: {
                background: 'rgba(99, 102, 241, 0.15)',
                backdropFilter: 'blur(30px) saturate(150%)'
            },
            container: {
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                borderRadius: '32px',
                padding: '48px',
                backdropFilter: 'blur(40px)',
                color: '#fff'
            },
            title: {
                color: '#818cf8',
                fontSize: '2.5rem',
                textAlign: 'center',
                fontFamily: 'Outfit, sans-serif'
            },
            description: {
                color: 'rgba(255, 255, 255, 0.7)',
                textAlign: 'center'
            },
            confirmButton: {
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '16px',
                padding: '16px 32px',
                border: 'none',
                color: '#fff'
            },
            cancelButton: {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }
        }
    })
    log(`Decision: ${result ? 'CONFIRMED' : 'CANCELLED'}`, result ? 'success' : 'cancel')
})

// 3. Destructive Action
document.getElementById('btn-destructive')?.addEventListener('click', async () => {
    log('Opening destructive action dialog...', 'info')
    const result = await confirm({
        title: 'Delete Project?',
        description: 'This action is irreversible. All associated data will be purged.',
        confirmText: 'Delete Permanently',
        cancelText: 'Keep Project',
        styles: {
            confirmButton: {
                background: '#dc2626',
                color: '#fff'
            }
        }
    })
    log(`Decision: ${result ? 'DELETED' : 'ABORTED'}`, result ? 'success' : 'cancel')
})

// 4. Async Test
document.getElementById('btn-async')?.addEventListener('click', async () => {
    log('Initiating async operations...', 'info')

    const result = await confirm({
        title: 'Deploy to Production?',
        description: 'This will trigger a CI/CD pipeline and update the live environment.',
        confirmText: 'Start Deployment',
        async onConfirm() {
            log('Deployment in progress (simulating 2.5s)...', 'info')
            await new Promise(resolve => setTimeout(resolve, 2500))
            return true
        }
    })

    if (result) {
        log('Production deployment completed successfully!', 'success')
    } else {
        log('Deployment procedure aborted by user', 'cancel')
    }
})

// 5. Queue Test
document.getElementById('btn-queue')?.addEventListener('click', async () => {
    log('Enqueued 3 sequential dialogs...', 'info')

    const p1 = confirm({
        title: 'Queue Sequence 1/3',
        description: 'ConfirmKit automatically manages a FIFO queue of dialogs.'
    })

    const p2 = confirm({
        title: 'Queue Sequence 2/3',
        description: 'The current dialog must resolve before the next one mounts.'
    })

    const p3 = confirm({
        title: 'Queue Sequence 3/3',
        description: 'This ensures zero overlapping and perfect accessibility focus management.'
    })

    const results = await Promise.all([p1, p2, p3])
    log(`Batch results: [${results.join(', ')}]`, 'success')
})

// 6. Sequential Flow (Using Await)
document.getElementById('btn-flow')?.addEventListener('click', async () => {
    log('Starting sequential wizard flow...', 'info')

    const step1 = await confirm({
        title: 'Step 1: Welcome',
        description: 'Shall we begin the setup process?',
        confirmText: 'Start'
    })

    if (!step1) {
        log('Wizard flow cancelled at Step 1', 'cancel')
        return
    }

    const step2 = await confirm({
        title: 'Step 2: Configuration',
        description: 'Apply default optimization settings?',
        confirmText: 'Apply'
    })

    if (!step2) {
        log('Wizard flow cancelled at Step 2', 'cancel')
        return
    }

    await confirm({
        title: 'Step 3: Complete',
        description: 'Setup finished successfully.',
        confirmText: 'Finish'
    })

    log('Wizard flow completed successfully', 'success')
})

// 7. Auto-close
document.getElementById('btn-autoclose')?.addEventListener('click', async () => {
    log('Opening auto-closing dialog (3s)...', 'info')

    const abortController = new AbortController()

    const timer = setTimeout(() => {
        log('Timer expired, closing dialog...', 'info')
        abortController.abort()
    }, 3000)

    try {
        const result = await confirm({
            title: 'Critical Alert',
            description: 'This window will self-destruct in 3 seconds.',
            confirmText: 'I am here!',
            // We pass the signal so it can be aborted externally
            onConfirm: () => {
                clearTimeout(timer)
                return true
            },
            onCancel: () => {
                clearTimeout(timer)
            }
        })

        if (result) {
            log('User acknowledged before timeout', 'success')
        }
    } catch (e) {
        log('Dialog closed by timeout', 'cancel')
    }
})

// 8. Advanced / Custom Context
document.getElementById('btn-advanced')?.addEventListener('click', async () => {
    log('Opening advanced context demo...', 'info')

    await confirm({
        title: (ctx: any) => `Hello, ${ctx.name || 'User'}!`,
        description: (ctx: any) => `Current score: ${ctx.score || 0}. Ready to level up?`,
        confirmText: 'Level Up',
        context: { name: 'Antigravity', score: 42 },
        async onConfirm(ctx: any) {
            log('Processing level up...', 'info')
            await new Promise(resolve => setTimeout(resolve, 1000))
            ctx.score += 10
            return true
        }
    })
    log('Advanced context demo completed', 'success')
})

// 9. Success Alert
document.getElementById('btn-success')?.addEventListener('click', async () => {
    log('Opening success notification...', 'info')
    await confirm({
        title: 'Payment Successful',
        description: 'Your transaction has been processed. A receipt was sent to your email.',
        confirmText: 'Great!',
        cancelText: '', // Hide cancel button if empty/null (Adapter dependent)
        styles: {
            confirmButton: {
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 10px 20px rgba(34, 197, 94, 0.25)'
            },
            cancelButton: {
                display: 'none' // since you want hidden
            }
        }
    })
    log('Success alert acknowledged', 'success')
})

// 10. Warning Alert
document.getElementById('btn-warning')?.addEventListener('click', async () => {
    log('Opening warning alert...', 'info')

    const result = await confirm({
        title: 'Low Storage',
        description: 'Your workspace is 90% full. Consider upgrading your plan.',
        confirmText: 'Upgrade Now',
        cancelText: 'Maybe Later',

        styles: {
            confirmButton: {
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 20px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 18px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.2s ease',
                marginLeft: '16px' // 👈 GAP FIX
            },

            cancelButton: {
                borderRadius: '10px',
                padding: '12px 20px'
            }
        }
    })

    log(`Decision: ${result ? 'UPGRADE' : 'IGNORED'}`, result ? 'success' : 'cancel')
})

// 11. Keyboard Shortcuts
document.getElementById('btn-keyboard')?.addEventListener('click', async () => {
    log('Opening keyboard shortcuts demo...', 'info')
    log('Tip: Press [Y] to confirm or [N] to cancel.', 'info')

    const result = await confirm({
        title: 'Custom Hotkeys',
        description: 'You can bind any key to confirm or cancel actions.',
        confirmText: 'Confirm [Y]',
        cancelText: 'Cancel [N]',
        confirmKey: 'y',
        cancelKey: 'n'
    })

    log(`Result: ${result ? 'Y pressed' : 'N pressed'}`, result ? 'success' : 'cancel')
})

// 12. Force Modal (No escape/backdrop)
document.getElementById('btn-modal')?.addEventListener('click', async () => {
    log('Opening forced interaction modal...', 'info')

    const result = await confirm({
        title: 'Action Required',
        description: 'You must click one of the buttons to close this window. Esc and backdrop clicks are disabled.',
        confirmText: 'I Understand',
        cancelText: 'Exit anyway',
        closeOnEsc: false
    })

    log(`Interaction recorded: ${result ? 'AGREED' : 'EXITED'}`, 'success')
})

// 13. Keyboard Wizard (Next/Close)
document.getElementById('btn-wizard')?.addEventListener('click', async () => {
    log('Starting Keyboard Wizard...', 'info')
    log('Tip: Press [N] for Next and [C] for Close.', 'info')
    const step1 = await confirm({
        title: 'Step 1: Welcome',
        description: 'Press [N] to continue or [C] to exit.',
        confirmText: 'Next [N]',
        cancelText: 'Close [C]',
        confirmKey: 'n',
        cancelKey: 'c'
    })

    if (!step1) {
        log('Wizard closed at Step 1', 'cancel')
        return
    }

    const step2 = await confirm({
        title: 'Step 2: Configuration',
        description: 'Almost there! Press [N] to finish.',
        confirmText: 'Finish [N]',
        cancelText: 'Exit [C]',
        confirmKey: 'n',
        cancelKey: 'c'
    })

    if (step2) {
        log('Keyboard wizard completed successfully via [N]!', 'success')
    } else {
        log('Wizard closed at Step 2 via [C]', 'cancel')
    }
})

// 14. NEW: Success Variant
document.getElementById('btn-success-preset')?.addEventListener('click', async () => {
    log('Opening success variant...', 'info')
    await confirm({
        title: 'Action Successful',
        description: 'The operation completed successfully using the built-in preset.',
        variant: 'success',
        icon: 'success'
    })
})

// 15. NEW: Error Variant
document.getElementById('btn-error-preset')?.addEventListener('click', async () => {
    log('Opening error variant...', 'info')
    await confirm({
        title: 'Operation Failed',
        description: 'An unexpected error occurred. This uses the error variant styling.',
        variant: 'error',
        icon: 'error'
    })
})

// 16. NEW: Warning Variant
document.getElementById('btn-warning-preset')?.addEventListener('click', async () => {
    log('Opening warning variant...', 'info')
    await confirm({
        title: 'High Resource Usage',
        description: 'Your system is running low on memory. Please close some apps.',
        variant: 'warning',
        icon: 'warning'
    })
})

// 17. NEW: Info Variant
document.getElementById('btn-info-preset')?.addEventListener('click', async () => {
    log('Opening info variant...', 'info')
    await confirm({
        title: 'Update Available',
        description: 'A new version of ConfirmKit is ready to be installed.',
        variant: 'info',
        icon: 'info'
    })
})

// 18. NEW: Custom Preset (using customConfirm instance)
document.getElementById('btn-custom-preset')?.addEventListener('click', async () => {
    log('Opening custom preset (using customConfirm instance)...', 'info')
    await customConfirm.confirm({
        title: 'Critical Danger',
        message: 'This uses a custom factory-level preset named "danger".',
        variant: 'danger',
        icon: 'error'
    })
})

// 19. NEW: Custom Icon (HTML/SVG & Element)
document.getElementById('btn-custom-icon')?.addEventListener('click', async () => {
    log('Opening custom icon demo...', 'info')

    // First, using HTML string (SVG)
    await confirm({
        title: 'SVG Icon (String)',
        description: 'Using a raw SVG string as an icon.',
        icon: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22m11-11H1"></path></svg>`
    })

    // Second, using HTMLElement
    const customEl = document.createElement('div')
    customEl.style.fontSize = '48px'
    customEl.textContent = '🚀'

    await confirm({
        title: 'Emoji Icon (Element)',
        description: 'Using a real DOM element as an icon.',
        icon: customEl
    })
})

// 20. SYNERGY: Success + Glass (Merge Priority demo)
document.getElementById('btn-synergy-1')?.addEventListener('click', async () => {
    log('Opening synergy: Success + Glass...', 'info')
    await confirm({
        variant: 'success',
        icon: 'success',
        title: 'Merge Priority',
        description: 'Default -> Preset -> Custom Styles. Success variant with glassmorphism blending.',
        styles: {
            overlay: {
                background: 'rgba(16, 185, 129, 0.15)',
                backdropFilter: 'blur(20px)'
            },
            container: {
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#064e3b'
            }
        }
    })
})

// 21. SYNERGY: Custom Preset + Emoji
document.getElementById('btn-synergy-2')?.addEventListener('click', async () => {
    log('Opening synergy: Custom + Emoji...', 'info')
    await customConfirm.confirm({
        variant: 'danger',
        icon: '⚠️',
        title: 'Critical Alert',
        message: 'Using "danger" preset from custom instance but overriding the icon with a text string.'
    })
})

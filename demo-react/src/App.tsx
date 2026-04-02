import React, { useState, useCallback } from 'react'
import { useConfirm } from '@confirmkit/react'

interface LogEntry {
  id: string
  time: string
  message: string
  type: 'info' | 'success' | 'cancel'
}

const App: React.FC = () => {
  const confirm = useConfirm()
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      message: 'Runtime initialized. Click a button to begin.',
      type: 'info'
    }
  ])

  const log = useCallback((message: string, type: 'info' | 'success' | 'cancel' = 'info') => {
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      message,
      type
    }
    setLogs(prev => [newEntry, ...prev])
  }, [])

  // 1. Default Confirm
  const handleDefault = async () => {
    log('Opening default confirmation...', 'info')
    const result = await confirm({
      title: 'Delete Resources?',
      description: 'This will permanently remove 12 selected items from your workspace.',
      confirmText: 'Delete Items',
      cancelText: 'Keep them'
    })
    log(`Decision: ${result ? 'PROCEEDED' : 'CANCELLED'}`, result ? 'success' : 'cancel')
  }

  // 2. Custom Styled Confirm (Glassmorphism)
  const handleCustom = async () => {
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
          background: 'rgba(255, 255, 255, 0.1) !important' as any,
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
  }

  // 4. Async Test
  const handleAsync = async () => {
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
  }

  // 5. Queue Test
  const handleQueue = async () => {
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
  }

  // 6. Sequential Flow
  const handleFlow = async () => {
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
  }

  // 7. Auto-close
  const handleAutoClose = async () => {
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
  }

  // 8. Keyboard Shortcuts
  const handleKeyboard = async () => {
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
  }

  // 9. Force Modal
  const handleModal = async () => {
    log('Opening forced interaction modal...', 'info')
    const result = await confirm({
      title: 'Action Required',
      description: 'You must click one of the buttons to close this window. Esc and backdrop clicks are disabled.',
      confirmText: 'I Understand',
      cancelText: 'Exit anyway',
      closeOnEsc: false
    })
    log(`Interaction recorded: ${result ? 'AGREED' : 'EXITED'}`, 'success')
  }

  // 10. Advanced Context
  const handleAdvanced = async () => {
    log('Opening advanced context demo...', 'info')
    await confirm({
      title: (ctx: any) => `Hello, ${ctx.name || 'User'}!`,
      description: (ctx: any) => `Current score: ${ctx.score || 0}. Ready to level up?`,
      confirmText: 'Level Up',
      context: { name: 'React User', score: 42 },
      async onConfirm(ctx: any) {
        log('Processing level up...', 'info')
        await new Promise(resolve => setTimeout(resolve, 1000))
        ctx.score += 10
        return true
      }
    })
    log('Advanced context demo completed', 'success')
  }

  // 11. Success Variant
  const handleVariant = async (variant: 'success' | 'error' | 'warning' | 'info') => {
    log(`Opening ${variant} variant...`, 'info')
    await confirm({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Action`,
      description: `The operation completed successfully using the built-in ${variant} preset.`,
      variant,
      icon: variant
    })
    log(`${variant} variant acknowledged`, 'success')
  }

  // 15. Custom Preset
  const handleCustomPreset = async () => {
    log('Opening custom preset (danger)...', 'info')
    await confirm({
      title: 'Critical Danger',
      description: 'This uses a custom factory-level preset named "danger".',
      variant: 'danger' as any,
      icon: 'error'
    })
  }

  // 16. Custom Icon
  const handleCustomIcon = async () => {
    log('Opening custom icon demo...', 'info')
    await confirm({
      title: 'SVG Icon (JSX)',
      description: 'Using a JSX SVG component as an icon.',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1v22m11-11H1"></path>
        </svg>
      )
    })

    await confirm({
      title: 'Emoji Icon (ReactNode)',
      description: 'Using a ReactNode (emoji) as an icon.',
      icon: <div style={{ fontSize: '48px' }}>🚀</div>
    })
  }

  // 17. Synergy 1: Success + Glass
  const handleSynergy1 = async () => {
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
  }

  // 18. Synergy 2: Custom + Emoji
  const handleSynergy2 = async () => {
    log('Opening synergy: Custom + Emoji...', 'info')
    await confirm({
      variant: 'danger' as any,
      icon: '⚠️',
      title: 'Critical Alert',
      description: 'Using "danger" preset from custom instance but overriding the icon with a text string.'
    })
  }

  return (
    <div className="container">
      <header>
        <h1>ConfirmKit</h1>
        <p className="subtitle">Production-grade React Dialogs</p>
      </header>

      <main className="card">
        <h2 className="section-title">✨ Interactive Showcase</h2>
        <div className="button-grid">
          <button onClick={() => handleVariant('success')} className="demo-btn success">
            <span>Success Variant</span>
          </button>
          <button onClick={() => handleVariant('error')} className="demo-btn danger">
            <span>Error Variant</span>
          </button>
          <button onClick={() => handleVariant('warning')} className="demo-btn warning">
            <span>Warning Variant</span>
          </button>
          <button onClick={() => handleVariant('info')} className="demo-btn primary">
            <span>Info Variant</span>
          </button>
          <button onClick={handleCustomPreset} className="demo-btn">
            <span>Custom Preset</span>
          </button>
          <button onClick={handleCustomIcon} className="demo-btn">
            <span>JSX/Emoji Icon</span>
          </button>

          <hr style={{ gridColumn: '1 / -1', border: 0, borderTop: '1px solid var(--border)', margin: '8px 0' }} />

          <button onClick={handleDefault} className="demo-btn primary">
            <span>Default Confirm</span>
          </button>
          <button onClick={handleCustom} className="demo-btn">
            <span>Glassmorphism</span>
          </button>
          <button onClick={handleAsync} className="demo-btn">
            <span>Async Loading</span>
          </button>
          <button onClick={handleQueue} className="demo-btn">
            <span>Queue Logic</span>
          </button>
          <button onClick={handleFlow} className="demo-btn">
            <span>Sequential Flow</span>
          </button>
          <button onClick={handleAutoClose} className="demo-btn">
            <span>Auto-close (3s)</span>
          </button>
          <button onClick={handleKeyboard} className="demo-btn">
            <span>Custom Keys</span>
          </button>
          <button onClick={handleModal} className="demo-btn">
            <span>Force Modal</span>
          </button>
          <button onClick={handleAdvanced} className="demo-btn">
            <span>Custom Context</span>
          </button>
          <button onClick={handleSynergy1} className="demo-btn success">
            <span>Merge: Success + Glass</span>
          </button>
          <button onClick={handleSynergy2} className="demo-btn danger">
            <span>Merge: Custom + Emoji</span>
          </button>
        </div>

        <h2 className="section-title">📜 System Log</h2>
        <div id="log">
          {logs.map(log => (
            <div key={log.id} className={`log-entry log-${log.type}`}>
              <span className="log-time">{log.time}</span>
              <span className="log-msg">{log.message}</span>
            </div>
          ))}
        </div>
      </main>

      <footer>
        Built with <code>@confirmkit/core</code> & <code>@confirmkit/react</code>
      </footer>
    </div>
  )
}

export default App

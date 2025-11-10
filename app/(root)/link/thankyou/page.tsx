import React from 'react'

const Page = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            padding: 20
        }}>
            <main style={{
                maxWidth: 640,
                width: '100%',
                background: '',
                padding: 32,
                borderRadius: 12,
                boxShadow: '0 8px 30px rgba(2,6,23,0.08)',
                textAlign: 'center'
            }} role="status" aria-live="polite">
                <div style={{
                    width: 84,
                    height: 84,
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#1F271B',
                    borderRadius: 999
                }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M20 6L9 17l-5-5" stroke="#059669" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                <h1 style={{marginTop: 18, marginBottom: 8, fontSize: 22, color: '#ffffff'}}>Thank you!</h1>
                <p style={{margin: 0, color: '#ffffff', lineHeight: 1.5}}>
                    Thank you for submitting a video. Please feel free to close this page.
                </p>
            </main>
        </div>
    )
}
export default Page

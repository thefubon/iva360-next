import React from 'react'

export const AdminLogo: React.FC = () => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      lineHeight: 1,
      minWidth: 0,
    }}
  >
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      alt="IVA360"
      height={28}
      src="/iva360.svg"
      style={{ display: 'block', height: '1.75rem', maxWidth: '100%', width: 'auto' }}
      width={77}
    />
  </div>
)

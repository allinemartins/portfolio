import type { ButtonHTMLAttributes } from 'react';
import { colors } from '../styles/colors';

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        background: colors.primary,
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: 6,
        cursor: 'pointer',
      }}
    />
  );
}
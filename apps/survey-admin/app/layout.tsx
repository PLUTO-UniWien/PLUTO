import './global.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'PLUTO Survey Admin',
  description: 'Survey management for PLUTO',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

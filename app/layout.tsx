import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Avsar AI | Skill Mapping & Internship Portal',
  description: 'Avsar AI Portal for Skill Mapping, Competency Diagnostics, and Internship Placements.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-900">
        <AppProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

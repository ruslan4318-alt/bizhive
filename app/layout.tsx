import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
    title: 'BIZHIVE - Marketing Agency for E-Commerce Growth',
    description: 'We help Shopee and TikTok Shop sellers scale their business through data-driven marketing, content production, and live commerce execution.',
    keywords: ['marketing agency', 'e-commerce', 'Shopee', 'TikTok Shop', 'live streaming', 'KOL management', 'content production'],
    authors: [{ name: 'BIZHIVE' }],
    openGraph: {
        title: 'BIZHIVE - Marketing Agency for E-Commerce Growth',
        description: 'We help Shopee and TikTok Shop sellers scale their business through data-driven marketing, content production, and live commerce execution.',
        type: 'website',
        locale: 'id_ID',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id">
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}

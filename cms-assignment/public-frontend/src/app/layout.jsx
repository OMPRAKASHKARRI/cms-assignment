import './globals.css';
import ReduxProvider from '../store/ReduxProvider';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { getSettings } from '../lib/api';

export const metadata = {
  title: 'RenewCred',
  description: 'Renewable energy credits, simplified.',
};

// Root layout fetches site-wide Settings once per request (nav/footer) —
// this data is genuinely global and rarely changes, so it lives here rather
// than being re-fetched or duplicated into Redux.
export default async function RootLayout({ children }) {
  const settings = await getSettings().catch(() => null);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <ReduxProvider>
          <SiteHeader siteName={settings?.siteName || 'RenewCred'} navLinks={settings?.navLinks || []} />
          <main className="flex-1">{children}</main>
          <SiteFooter footer={settings?.footer} />
        </ReduxProvider>
      </body>
    </html>
  );
}

import '../index.css';
import CartDrawer from '../components/layout/CartDrawer';
import SyncUser from '../components/SyncUser';
import { ClerkProvider } from '@clerk/nextjs'
import { neobrutalism } from '@clerk/themes';

export const metadata = {
  title: 'Socky',
  description: 'Socks that don’t feel basic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
        variables: {
          colorPrimary: '#000000',
          colorBackground: '#fbfbf2',
          colorText: '#000000',
          fontFamily: 'Poppins, sans-serif',
          borderRadius: '16px',
        },
        elements: {
          card: 'border-4 border-black shadow-[8px_8px_0px_#000] bg-[#fbfbf2] p-6',
          headerTitle: 'font-black uppercase tracking-tighter text-3xl italic',
          headerSubtitle: 'font-medium text-neutral-600',
          formButtonPrimary: 'bg-black hover:bg-neutral-800 border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] transition-all active:shadow-none active:translate-x-1 active:translate-y-1 py-3 text-sm font-bold uppercase tracking-widest',
          socialButtonsBlockButton: 'border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all hover:bg-neutral-50',
          socialButtonsBlockButtonText: 'font-bold text-sm',
          formFieldLabel: 'font-black uppercase text-[10px] tracking-widest mb-1 ml-1',
          formFieldInput: 'border-2 border-black rounded-2xl focus:ring-0 focus:border-black bg-white px-4 py-3 font-medium transition-all focus:shadow-[4px_4px_0px_#000]',
          footerActionLink: 'font-black underline decoration-2 underline-offset-4 hover:text-neutral-700 transition-colors',
          identityPreviewText: 'font-bold',
          userButtonPopoverCard: 'border-4 border-black shadow-[8px_8px_0px_#000] bg-[#fbfbf2] rounded-2xl',
          userButtonTrigger: 'border-2 border-black rounded-full shadow-[2px_2px_0px_#000] transition-all hover:shadow-[4px_4px_0px_#000]',
        }
      }}
    >
      <html lang="en">
        <body suppressHydrationWarning>
          <SyncUser />
          {children}
          <CartDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}

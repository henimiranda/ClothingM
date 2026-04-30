import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ClothingM | Premium E-Commerce & SCM',
  description: 'The ultimate clothing management and e-commerce platform.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-12 bg-corporate-900 text-corporate-400 px-6 text-center border-t border-corporate-800">
              <p>&copy; 2026 ClothingM System. All rights reserved.</p>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}

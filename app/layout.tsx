import type { Metadata } from 'next'
import { Inter, Katibeh } from 'next/font/google';
import './globals.css'

const inter= Inter({ subsets: ['latin'] });

const katibah = Katibeh({
  weight: ['400',],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Auto Diagrams - We provide every auto architecture',
  description: 'Ottman Empire - Home of Clothings',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-[#1B263B] text-[#ffffff]  ${katibah.className} ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from "next";
import "./globals.scss";
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import Header from "@/containers/Header";
import Footer from "@/containers/Footer";
import Providers from "./providers";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Vergilix",
  description: "The best exchange rates cryptocurrency",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Header/>
              {children}
              <ChatWidget/>
            <Footer/>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

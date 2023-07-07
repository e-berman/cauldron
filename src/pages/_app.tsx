import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/dist/shared/lib/utils";
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <ClerkProvider {...pageProps} >
      <Component {...pageProps} />
      <Analytics />
    </ClerkProvider>
  );
  
};

export default MyApp;

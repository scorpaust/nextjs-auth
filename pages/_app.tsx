import Layout from '@/components/layout/layout'
import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'

function App({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>);
}

export default App;
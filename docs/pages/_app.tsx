import '../globals.css'
import { SSRProvider } from "@react-aria/ssr";

 
export default function App({ Component, pageProps }) {
  return <SSRProvider><Component {...pageProps} /></SSRProvider>
}
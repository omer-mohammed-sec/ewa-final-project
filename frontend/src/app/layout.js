import "./globals.css";
import { CartProvider } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Agaseke Heritage Market | Traditional Rwandan Crafts & Art",
  description: "Explore and purchase hand-woven Agaseke baskets, geometric Imigongo paintings, specialty Virunga coffee, and handmade beaded accessories. Direct from local Rwandan artisans to the world.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

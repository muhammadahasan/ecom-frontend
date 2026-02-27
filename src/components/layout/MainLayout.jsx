import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

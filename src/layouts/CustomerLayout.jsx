export default function CustomerLayout({ children }) {
  return (
    <div>
      <nav>Navbar</nav>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}

export default function OwnerLayout({ children }) {
  return (
    <div>
      <nav>OwnerNavbar</nav>
      <main>{children}</main>
    </div>
  );
}

import Link from "next/link";

function Nav() {
  return (
    <nav className="flex gap-10">
      <Link href="/">Home</Link>
      <Link href="/lazy-loading">Lazy Loading</Link>
      <Link href="/virtualization">Virtualization</Link>
      <Link href="/cetingan-gepete">Cetingan Sama Gepete</Link>
      <Link href="/location">Map</Link>
    </nav>
  );
}

export default Nav;

import Link from "next/link";

function Nav() {
  return (
    <nav className="flex gap-10">
      <Link href="/">Home</Link>
      <Link href="/lazy-loading">Lazy Loading</Link>
    </nav>
  );
}

export default Nav;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { space } from "../theme";

const NAV_ITEMS = [
  { href: "/", label: "Pagrindinis" },
  { href: "/screens/orders", label: "Užsakymai" },
  { href: "/screens/customers", label: "Klientai" },
  { href: "/screens/cars", label: "Automobiliai" },
  { href: "/screens/parts", label: "Dalys" },
];

// "/" only matches itself; every other item also owns its sub-routes, so an
// order detail page keeps "Užsakymai" highlighted.
const isActive = (pathname, href) =>
  href === "/" ? pathname === "/" : pathname?.startsWith(href);

function Header() {
  const pathname = usePathname();

  return (
    <header style={style.root}>
      <div style={style.inner}>
        <Link href="/" style={style.brand}>
          <span style={style.mark}>MS</span>
          <span style={style.text}>Merselita servisas</span>
        </Link>

        <nav className="app-nav" aria-label="Pagrindinė navigacija">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Header;

const style = {
  root: {
    position: "sticky",
    top: 0,
    zIndex: 900,
    width: "100%",
    backgroundColor: "rgba(15, 23, 42, 0.96)",
    backdropFilter: "saturate(180%) blur(8px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 4px 20px rgba(15, 23, 42, 0.18)",
  },
  inner: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: `${space.sm} ${space.xl}`,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: `${space.md} ${space.xl}`,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    textDecoration: "none",
    flexShrink: 0,
  },
  mark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    flexShrink: 0,
    background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
    color: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.45)",
    fontSize: "0.85rem",
    fontWeight: 800,
    letterSpacing: "0.02em",
  },
  text: {
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },
};

import { colors, space, shadow } from "../theme";

function Header() {
  return (
    <header style={style.root}>
      <div style={style.inner}>
        <span style={style.mark}>MS</span>
        <h1 style={style.text}>Merselita servisas</h1>
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
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    boxShadow: shadow.sm,
  },
  inner: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    maxWidth: "1100px",
    margin: "0 auto",
    padding: `${space.md} ${space.xl}`,
  },
  mark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "34px",
    height: "34px",
    flexShrink: 0,
    backgroundColor: colors.accent,
    color: colors.surface,
    borderRadius: "9px",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  text: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: colors.text,
  },
};

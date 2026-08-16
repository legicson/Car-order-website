function Header() {
  return (
    <>
      <header style={style.root}>
        <h1 style={style.text}>Merselita servisas</h1>
      </header>
    </>
  );
}

export default Header;

const style = {
  root: {
    // backgroundColor: "#7d85ca",
    width: "100%",

    height: "5vh",
    justifyContent: "left",
    alignItems: "center",
    display: "flex",
  },
  text: {
    margin: "0 0 0 5vh",
    padding: 0,
    fontSize: "25px",
    fontWeight: "bold",
    fontStyle: "italic",
    // textAlign: "left",
  },
};

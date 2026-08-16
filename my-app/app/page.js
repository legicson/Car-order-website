import Dropdown from "./components/UI/Dropdown";

export default function Home() {
  return (
    <div style={style.root}>
      <div style={style.content}>
        <div style={style.mainDropdown}></div>
      </div>
    </div>
  );
}

const style = {
  root: {
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100vh",
  },
  content: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flex: 1,
  },
  mainDropdown: {
    // justifyContent: "start",
    backgroundColor: "#bf3636",
  },
};

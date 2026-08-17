function CustomButton({ onClick, ButtonText }) {
  return (
    <button style={style.root} onClick={onClick}>
      <h3>{ButtonText}</h3>
    </button>
  );
}

export default CustomButton;

const style = {
  root: {
    borderRadius: "15px",
    margin: "10px",
    width: "200px",
    height: "50px",
    backgroundColor: "#9539F2",
    border: "none",
    color: "#eaecf3e0",
    fontWeight: "bold",
  },
};

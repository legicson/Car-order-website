function CustomButton({ onClick, ButtonText, variant = "primary" }) {
  return (
    <button className={`app-btn app-btn-${variant}`} onClick={onClick}>
      {ButtonText}
    </button>
  );
}

export default CustomButton;

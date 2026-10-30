function CustomButton({
  onClick,
  ButtonText,
  variant = "primary",
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`app-btn app-btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {ButtonText}
    </button>
  );
}

export default CustomButton;

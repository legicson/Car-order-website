"use client";

import Dropdown from "react-bootstrap/Dropdown";
import { colors, radius, shadow, space } from "../theme";

export const STATUSES = [
  { value: "Active", label: "Vykdomas" },
  { value: "Waiting for parts", label: "Laukia dalių" },
  { value: "Finished", label: "Baigtas" },
];

const STATUS_COLORS = {
  Active: { color: colors.warning, backgroundColor: colors.warningSoft },
  Finished: { color: colors.success, backgroundColor: colors.successSoft },
  "Waiting for parts": {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
};

export const getStatusStyle = (status) =>
  STATUS_COLORS[status] ?? {
    color: colors.accent,
    backgroundColor: colors.accentSoft,
  };

export const getStatusLabel = (status) =>
  STATUSES.find((item) => item.value === status)?.label ?? "Nenurodyta";

export default function StatusDropdown({
  status,
  setStatus,
  placeholder = "Pasirinkite statusą",
  disabled = false,
}) {
  const handleSelect = (eventKey) => {
    if (eventKey) {
      setStatus(eventKey);
    }
  };

  const selected = STATUSES.find((item) => item.value === status);

  return (
    <Dropdown onSelect={handleSelect} align="end">
      <Dropdown.Toggle
        style={style.mainButton}
        id="status-dropdown"
        disabled={disabled}
      >
        {selected ? (
          <span style={{ ...style.badge, ...getStatusStyle(selected.value) }}>
            {selected.label}
          </span>
        ) : (
          <span style={style.placeholder}>{placeholder}</span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {STATUSES.map((item) => (
          <Dropdown.Item
            key={item.value}
            eventKey={item.value}
            active={item.value === status}
          >
            <span style={{ ...style.badge, ...getStatusStyle(item.value) }}>
              {item.label}
            </span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const style = {
  mainButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: radius.md,
    boxShadow: shadow.sm,
    color: colors.text,
    fontSize: "0.95rem",
    fontWeight: 600,
    padding: "9px 18px",
  },
  badge: {
    padding: "5px 12px",
    borderRadius: radius.pill,
    fontSize: "0.8rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: "0.9rem",
    fontWeight: 600,
  },
};

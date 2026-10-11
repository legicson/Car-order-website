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

// Whole-surface fill: status text colour on its soft background, with a
// border in the text colour at low opacity so the edge stays visible.
const statusFill = (status) => {
  const { color, backgroundColor } = getStatusStyle(status);
  return {
    color,
    backgroundColor,
    borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
  };
};

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
        className="status-toggle"
        style={{
          ...style.mainButton,
          ...(selected ? statusFill(selected.value) : {}),
        }}
        id="status-dropdown"
        disabled={disabled}
      >
        {selected ? (
          selected.label
        ) : (
          <span style={style.placeholder}>{placeholder}</span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="status-menu">
        {STATUSES.map((item) => {
          const isSelected = item.value === status;
          return (
            <Dropdown.Item
              key={item.value}
              eventKey={item.value}
              active={isSelected}
              className="status-item"
              style={{ ...style.item, ...statusFill(item.value) }}
            >
              <span>{item.label}</span>
              {isSelected && <span aria-hidden="true">✓</span>}
            </Dropdown.Item>
          );
        })}
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
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    border: "1px solid transparent",
    fontWeight: 600,
  },
  placeholder: {
    color: colors.textMuted,
    fontSize: "0.9rem",
    fontWeight: 600,
  },
};

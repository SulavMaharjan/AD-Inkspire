import React from "react";

const ToggleSwitch = ({ label, name, checked, onChange }) => {
  return (
    <div className="toggle-field">
      <label className="toggle-label">
        <span className="toggle-text">{label}</span>
        <div className="toggle-switch-wrapper">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="toggle-input"
          />
          <div className="toggle-switch">
            <div className="toggle-slider"></div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;

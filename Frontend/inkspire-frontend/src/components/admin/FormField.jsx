import React from "react";

const FormField = ({
  label,
  name,
  type,
  error,
  required = false,
  as = "input",
  options = [],
  children,
  ...props
}) => {
  const inputClasses = `form-control ${error ? "error" : ""}`;

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label} {required && <span className="required">*</span>}
      </label>

      {as === "input" && (
        <input
          id={name}
          name={name}
          type={type}
          className={inputClasses}
          {...props}
        />
      )}

      {as === "textarea" && (
        <textarea id={name} name={name} className={inputClasses} {...props} />
      )}

      {as === "select" && (
        <select id={name} name={name} className={inputClasses} {...props}>
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {children}

      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormField;

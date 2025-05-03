import { motion } from "framer-motion";
import { FaUser, FaUserTie, FaUserShield } from "react-icons/fa";
import Button from "../UI/Button";
import "../../styles/Auth.css";

const RoleSelection = ({
  selectedRole,
  onSelect,
  onBack,
  onSubmit,
  loading,
}) => {
  const roles = [
    {
      id: "member",
      label: "Member",
      icon: FaUser,
      description: "Browse books and manage your reading list",
    },
    {
      id: "staff",
      label: "Staff",
      icon: FaUserTie,
      description: "Manage book inventory and member requests",
    },
    {
      id: "superAdmin",
      label: "superAdmin",
      icon: FaUserShield,
      description: "Full access to all library functions",
    },
  ];

  return (
    <motion.div
      className="role-selection"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h3>Select your role</h3>
      <div className="roles-container">
        {roles.map((role) => (
          <motion.div
            key={role.id}
            className={`role-card ${
              selectedRole === role.id ? "selected" : ""
            }`}
            onClick={() => onSelect(role.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="role-icon">
              <role.icon />
            </div>
            <div className="role-details">
              <h4>{role.label}</h4>
              <p>{role.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="role-actions">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={!selectedRole || loading}
          onClick={onSubmit}
        >
          {loading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </motion.div>
  );
};

export default RoleSelection;

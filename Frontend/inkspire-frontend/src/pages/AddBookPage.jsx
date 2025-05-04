import React from "react";
import AddBookForm from "../components/admin/AddBookForm.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import "../styles/admin.css";

const AddBookPage = () => {
  return (
    <AdminLayout>
      <div className="add-book-page">
        <h1 className="page-title">Add New Book</h1>
        <p className="page-description">
          Create a new book entry in the catalog. Fields marked with * are
          required.
        </p>
        <AddBookForm />
      </div>
    </AdminLayout>
  );
};

export default AddBookPage;

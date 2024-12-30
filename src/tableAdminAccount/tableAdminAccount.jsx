import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableAdminAccount.css";

function AdminAccountTable() {
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [nomModif, setNomModif] = useState("");
  const [prenomModif, setPrenomModif] = useState("");
  const [emailModif, setEmailModif] = useState("");
  const [indexModif, setIndexModif] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [nomAdd, setNomAdd] = useState("");
  const [prenomAdd, setPrenomAdd] = useState("");
  const [emailAdd, setEmailAdd] = useState("");

  // Fetching admin accounts from the API
  useEffect(() => {
    fetch("http://localhost:8081/admin/getadmins")
      .then((response) => response.json()) // Parse the JSON response
      .then((data) => setAdminAccounts(data)) // Update the state with the fetched data
      .catch((error) => console.error("Error fetching admin accounts:", error));
  }, []); // Empty dependency array ensures this effect runs only once

  

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };

  const hideModalAdd = () => {
    setIsModalAddOpen(false);
  };

  const modifier = async (index) => {
    // Set the state values for the fields you want to modify based on the selected admin
    setNomModif(adminAccounts[index].nom);
    setPrenomModif(adminAccounts[index].prenom);
    setEmailModif(adminAccounts[index].email);
    setIndexModif(index); // Keep track of the index of the admin being modified
  
    // Show the modal where the admin data will be modified
    showModal();
  };
  
  const sauvegarderChanges = async () => {
    try {
      const updatedAdmin = {
        code: adminAccounts[indexModif].code, // Use the admin ID from the selected index
        nom: nomModif, // Include the updated fields only
        prenom: prenomModif,
        email: emailModif,
      };
  
      // Send the PUT request to update the admin account
      const response = await fetch("http://localhost:8081/admin/updateadmin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Specify that you're sending JSON
        },
        body: JSON.stringify(updatedAdmin), // Convert the updatedAdmin object to a JSON string
      });
  
      // Check if the response is okay (status 200-299)
      if (response.ok) {
        console.log("Admin account updated successfully");
  
        // Optionally, update the local state to reflect the changes
        const updatedAdminAccounts = [...adminAccounts];
    
        // Update only the modified fields in the local list
        updatedAdminAccounts[indexModif] = {
          ...updatedAdminAccounts[indexModif], // Keep other unchanged properties
          ...updatedAdmin, // Update the modified fields
        };
    
        setAdminAccounts(updatedAdminAccounts); // Update the state with the new admin list
      } else {
        console.error("Failed to update admin account");
      }
    } catch (error) {
      console.error("Error updating admin account:", error);
    }
  
    hideModal(); // Close the modal after saving changes
  };
  

  const deleteAdminAccount = (index) => {
    const adminToDelete = adminAccounts[index];
  
    // Send DELETE request to API
    fetch("http://localhost:8081/admin/deleteadmin", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: adminToDelete.code }),
    })
      .then((response) => {
        if (response.ok) {
          // Remove the deleted admin from the state
          setAdminAccounts(adminAccounts.filter((_, idx) => idx !== index));
        } else {
          console.error("Error deleting admin account");
        }
      })
      .catch((error) => {
        console.error("Error deleting admin account:", error);
      });
  };
  

  const addAdminAccount = () => {
    fetch("http://localhost:8081/admin/addadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: nomAdd,
        prenom: prenomAdd,
        email: emailAdd,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add admin account");
        }
        setAdminAccounts([
          ...adminAccounts,
          { id: Date.now(), nom: nomAdd, prenom: prenomAdd, email: emailAdd },
        ]);
      })
      .catch((error) => {
        console.error("Error adding admin account:", error);
      });
  
    hideModalAdd();
  };
  
  
  return (
    <>
      <button className="btn btn-info" onClick={showModalAdd}>
        Ajouter un Compte Administrateur
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {adminAccounts.map((account, index) => (
            <tr key={account.code}>
              <td>{account.nom}</td>
              <td>{account.prenom}</td>
              <td>{account.email}</td>
              <td>
                <button onClick={() => modifier(index)} className="btn btn-info">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  onClick={() => deleteAdminAccount(index)}
                  className="btn btn-danger"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Modification */}
      <Modal show={isModalOpen} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier un Compte Administrateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nom</label>
            <input
              className="form-control"
              value={nomModif}
              onChange={(e) => setNomModif(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Prénom</label>
            <input
              className="form-control"
              value={prenomModif}
              onChange={(e) => setPrenomModif(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={emailModif}
              onChange={(e) => setEmailModif(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={hideModal}>
            Fermer
          </button>
          <button className="btn btn-primary" onClick={sauvegarderChanges}>
            Sauvegarder
          </button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Addition */}
      <Modal show={isModalAddOpen} onHide={hideModalAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Compte Administrateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nom</label>
            <input
              className="form-control"
              onChange={(e) => setNomAdd(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Prénom</label>
            <input
              className="form-control"
              onChange={(e) => setPrenomAdd(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              onChange={(e) => setEmailAdd(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={hideModalAdd}>
            Fermer
          </button>
          <button className="btn btn-primary" onClick={addAdminAccount}>
            Ajouter
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminAccountTable;

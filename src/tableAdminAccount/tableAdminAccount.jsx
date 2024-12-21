import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableAdminAccount.css";

function AdminAccountTable() {
  const [adminAccounts, setAdminAccounts] = useState([
    { id: 1, nom: "Ali", prenom: "Kamal", email: "ali.kamal@example.com" },
    { id: 2, nom: "Nadia", prenom: "Sami", email: "nadia.sami@example.com" },
  ]);

  const [nomModif, setNomModif] = useState("");
  const [prenomModif, setPrenomModif] = useState("");
  const [emailModif, setEmailModif] = useState("");
  const [indexModif, setIndexModif] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [nomAdd, setNomAdd] = useState("");
  const [prenomAdd, setPrenomAdd] = useState("");
  const [emailAdd, setEmailAdd] = useState("");

  const modifier = (index) => {
    setNomModif(adminAccounts[index].nom);
    setPrenomModif(adminAccounts[index].prenom);
    setEmailModif(adminAccounts[index].email);
    setIndexModif(index);
    showModal();
  };

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

  const sauvegarderChanges = () => {
    setAdminAccounts(
      adminAccounts.map((account, index) => {
        if (index === indexModif) {
          return { ...account, nom: nomModif, prenom: prenomModif, email: emailModif };
        }
        return account;
      })
    );
    hideModal();
  };

  const deleteAdminAccount = (index) => {
    setAdminAccounts(adminAccounts.filter((_, idx) => idx !== index));
  };

  const addAdminAccount = () => {
    setAdminAccounts([
      ...adminAccounts,
      { id: Date.now(), nom: nomAdd, prenom: prenomAdd, email: emailAdd },
    ]);
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
            <tr key={account.id}>
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

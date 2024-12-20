import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./TableFiliere.css";

function FiliereTable() {
  const [TFiliere, setTFiliere] = useState([
    { nom: "Ingénierie Informatique", description: "Filière spécialisée en informatique et data.", nbEtudiants: 120 },
    { nom: "Génie Civil", description: "Filière orientée vers les infrastructures.", nbEtudiants: 80 },
    { nom: "Management Industriel", description: "Gestion et management pour l'industrie.", nbEtudiants: 100 },
  ]);

  const [nomModif, setNomModif] = useState("");
  const [descriptionModif, setDescriptionModif] = useState("");
  const [nbEtudiantsModif, setNbEtudiantsModif] = useState("");
  const [indexModif, setIndexModif] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [nomAdd, setNomAdd] = useState("");
  const [descriptionAdd, setDescriptionAdd] = useState("");
  const [nbEtudiantsAdd, setNbEtudiantsAdd] = useState("");

  const modifier = (index) => {
    setNomModif(TFiliere[index].nom);
    setDescriptionModif(TFiliere[index].description);
    setNbEtudiantsModif(TFiliere[index].nbEtudiants);
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

  // Save changes and update the table
  const sauvegarderChanges = () => {
    setTFiliere(
      TFiliere.map((filiere, index) => {
        if (index === indexModif) {
          return {
            nom: nomModif,
            description: descriptionModif,
            nbEtudiants: nbEtudiantsModif,
          };
        }
        return filiere;
      })
    );
    hideModal();
  };

  const deleteFiliere = (index) => {
    setTFiliere(TFiliere.filter((_, idx) => idx !== index));
  };

  const addFiliere = () => {
    setTFiliere([...TFiliere, { nom: nomAdd, description: descriptionAdd, nbEtudiants: nbEtudiantsAdd }]);
    hideModalAdd();
  };

  return (
    <>
      <button className="btn btn-info" onClick={showModalAdd}>
        Ajouter une filière
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Nom de la filière</th>
            <th>Description</th>
            <th>Nombre d'étudiants</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {TFiliere.map((filiere, index) => (
            <tr key={index}>
              <td>{filiere.nom}</td>
              <td>{filiere.description}</td>
              <td>{filiere.nbEtudiants}</td>
              <td>
                <button onClick={() => modifier(index)} className="btn btn-info">
                  Modifier
                </button>
              </td>
              <td>
                <button onClick={() => deleteFiliere(index)} className="btn btn-danger">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for modification */}
      <Modal show={isModalOpen} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modification d'une filière</Modal.Title>
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
            <label>Description</label>
            <input
              className="form-control"
              value={descriptionModif}
              onChange={(e) => setDescriptionModif(e.target.value)}
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

      {/* Modal for addition */}
      <Modal show={isModalAddOpen} onHide={hideModalAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une filière</Modal.Title>
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
            <label>Description</label>
            <input
              className="form-control"
              onChange={(e) => setDescriptionAdd(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={hideModalAdd}>
            Fermer
          </button>
          <button className="btn btn-primary" onClick={addFiliere}>
            Ajouter
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FiliereTable;

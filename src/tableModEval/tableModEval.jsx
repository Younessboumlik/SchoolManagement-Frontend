import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableModEval.css";

function ModEvalTable() {
  const [TModEval, setTModEval] = useState([
    { nom: "Examen", description: "L'examen" },
    { nom: "TP", description: "Travaux pratique"},
    { nom: "Projet", description: "Le Projet"},
  ]);

  const [nomModif, setNomModif] = useState("");
  const [descriptionModif, setDescriptionModif] = useState("");
  const [indexModif, setIndexModif] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [nomAdd, setNomAdd] = useState("");
  const [descriptionAdd, setDescriptionAdd] = useState("");


  const [filterNom, setFilterNom] = useState("");
  const [filterDescription, setfilterDescription] = useState("");



  const filteredModEval = TModEval.filter((modeeval) => {
    return (
        modeeval.nom.toLowerCase().includes(filterNom.toLowerCase()) &&
        modeeval.description.toLowerCase().includes(filterDescription.toLowerCase())
    );
  });

  const modifier = (index) => {
    setNomModif(TModEval[index].nom);
    setDescriptionModif(TModEval[index].description);
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

  

  const handleNomChange = (e) => {
    setNomModif(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionModif(e.target.value);
  };



  const handleNomaddChange = (e) => {
    setNomAdd(e.target.value); // Update the 'nonadd' state with the input value
  };
  
  const handleDescriptionaddChange = (e) => {
    setDescriptionAdd(e.target.value); // Update the 'prenomadd' state with the input value
  };
  

  const sauvegarderChanges = () => {
    setTModEval(
      TModEval.map((modeval, index) => {
        if (index === indexModif) {
          return {
            nom: nomModif,
            description: descriptionModif,
          };
        }
        return modeval;
      })
    );
    hideModal();
  };

  const deleteModEval = (index) => {
    setTModEval(TModEval.filter((_, idx) => idx !== index));
  };

  const addModEval = () => {
    setTModEval([...TModEval, { nom: nomAdd, description: descriptionAdd }]);
    hideModalAdd();
  };

  const highlightMatch = (text, filter) => {
    if (!filter) return text; // No filter, return original text
    const regex = new RegExp(`(${filter})`, 'gi'); // Match filter text
    return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap match
  };

  return (
    <>
      <button className="btn btn-info" onClick={showModalAdd}>
        Ajouter une Modalite d'evaluation
      </button>
      <table className="table">
        <thead>
        <tr>
          <th>
            <input
              type="text"
              className="form-control"
              placeholder="Filter Nom"
              value={filterNom}
              onChange={(e) => setFilterNom(e.target.value)}
            />
          </th>
          <th>
            <input
              type="text"
              className="form-control"
              placeholder="Filter Description"
              value={filterDescription}
              onChange={(e) => setfilterDescription(e.target.value)}
            />
          </th>
          <th></th>
          <th></th>
        </tr>
          <tr>
            <th>Nom de la filière</th>
            <th>Description</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {filteredModEval.map((modeeval, index) => (
            <tr key={index}>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(modeeval.nom, filterNom) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(modeeval.description, filterDescription) }}></td>
              <td>
                <button onClick={() => modifier(index)} className="btn btn-info">
                <i className="fa-solid fa-pen"></i>
                </button>
              </td>
              <td>
                <button onClick={() => deleteModEval(index)} className="btn btn-danger">
                <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for modification */}
      <Modal show={isModalOpen} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modification d'une Modalite d'evaluation</Modal.Title>
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
          <Modal.Title>Ajouter une Modalite d'evaluation</Modal.Title>
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
          <button className="btn btn-primary" onClick={addModEval}>
            Ajouter
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModEvalTable;

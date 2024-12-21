import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableProfElement.css";

function ElementModuleTable() {
  const [TElementModule, setTElementModule] = useState([
    { module: "Algèbre", description: "Élément de module mathématique", professeur: "Dr. Ali Kamal" },
    { module: "Programmation", description: "Introduction à Java", professeur: "Mme. Nadia Sami" },
    { module: "Chimie Organique", description: "Chimie avancée", professeur: "Dr. Omar Rami" },
  ]);

  const [professors, setProfessors] = useState(["El gherabi", "Saadi"]);
  const [modules, setModules] = useState([]);

  const [moduleModif, setModuleModif] = useState("");
  const [professeurModif, setProfesseurModif] = useState("");
  const [indexModif, setIndexModif] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [moduleAdd, setModuleAdd] = useState("");
  const [professeurAdd, setProfesseurAdd] = useState("");

  const [filterModule, setFilterModule] = useState("");
  const [filterProfesseur, setFilterProfesseur] = useState("");
  const [filterDescription, setFilterDescription] = useState("");

  useEffect(() => {
    const fetchProfessors = async () => {
      const response = await fetch("https://api.example.com/professors");
      const data = await response.json();
      setProfessors(data); // Example: [{ id: 1, name: "Dr. Ali Kamal" }]
    };

    const fetchModules = async () => {
      const response = await fetch("https://api.example.com/modules");
      const data = await response.json();
      setModules(data); // Example: [{ id: 1, name: "Mathématiques" }]
    };

    fetchProfessors();
    fetchModules();
  }, []);

  const filteredElementModule = TElementModule.filter((elementModule) => {
    return (
      elementModule.module.toLowerCase().includes(filterModule.toLowerCase()) &&
      elementModule.professeur.toLowerCase().includes(filterProfesseur.toLowerCase()) &&
      elementModule.description.toLowerCase().includes(filterDescription.toLowerCase())
    );
  });

  const modifier = (index) => {
    setModuleModif(TElementModule[index].module);
    setProfesseurModif(TElementModule[index].professeur);
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
    setTElementModule(
      TElementModule.map((elementModule, index) => {
        if (index === indexModif) {
          return {
            ...elementModule,
            module: moduleModif,
            professeur: professeurModif,
          };
        }
        return elementModule;
      })
    );
    hideModal();
  };

  const deleteElementModule = (index) => {
    setTElementModule(TElementModule.filter((_, idx) => idx !== index));
  };

  const addElementModule = () => {
    setTElementModule([
      ...TElementModule,
      { module: moduleAdd, description: "Description par défaut", professeur: professeurAdd },
    ]);
    hideModalAdd();
  };

  return (
    <>
      <button className="btn btn-info" onClick={showModalAdd}>
        Affecter des éléments de module aux professeurs
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                className="form-control"
                placeholder="Filtrer Module"
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control"
                placeholder="Filtrer Professeur"
                value={filterProfesseur}
                onChange={(e) => setFilterProfesseur(e.target.value)}
              />
            </th>
            <th>
              <input
                type="text"
                className="form-control"
                placeholder="Filtrer Description"
                value={filterDescription}
                onChange={(e) => setFilterDescription(e.target.value)}
              />
            </th>
            <th>Actions</th>
          </tr>
          <tr>
            <th>Module</th>
            <th>Professeur</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredElementModule.map((elementModule, index) => (
            <tr key={index}>
              <td>{elementModule.module}</td>
              <td>{elementModule.professeur}</td>
              <td>{elementModule.description}</td>
              <td>
                <button onClick={() => modifier(index)} className="btn btn-info">
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button
                  onClick={() => deleteElementModule(index)}
                  className="btn btn-danger"
                >
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
          <Modal.Title>Modifier un Élément de Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Module</label>
            <select
              className="form-control"
              value={moduleModif}
              onChange={(e) => setModuleModif(e.target.value)}
            >
              <option value="">-- Choisir un Module --</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.name}>
                  {mod.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Professeur</label>
            <select
              className="form-control"
              value={professeurModif}
              onChange={(e) => setProfesseurModif(e.target.value)}
            >
              <option value="">-- Choisir un Professeur --</option>
              {professors.map((prof) => (
                <option key={prof.id} value={prof.name}>
                  {prof.name}
                </option>
              ))}
            </select>
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
          <Modal.Title>Affecter des éléments de module aux professeurs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Module</label>
            <select
              className="form-control"
              onChange={(e) => setModuleAdd(e.target.value)}
            >
              <option value="">-- Choisir un Module --</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.name}>
                  {mod.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Professeur</label>
            <select
              className="form-control"
              onChange={(e) => setProfesseurAdd(e.target.value)}
            >
              <option value="">-- Choisir un Professeur --</option>
              {professors.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={hideModalAdd}>
            Fermer
          </button>
          <button className="btn btn-primary" onClick={addElementModule}>
            Ajouter
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ElementModuleTable;

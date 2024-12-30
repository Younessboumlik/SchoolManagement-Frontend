import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableProfElement.css";

function ElementModuleTable() {
  const [TElementModule, setTElementModule] = useState([
    { module: "Algèbre", description: "Élément de module mathématique", professeur: "Dr. Ali Kamal" },
    { module: "Programmation", description: "Introduction à Java", professeur: "Mme. Nadia Sami" },
    { module: "Chimie Organique", description: "Chimie avancée", professeur: "Dr. Omar Rami" },
  ]);

  const [professors, setProfessors] = useState([]);
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
      const response = await fetch("http://localhost:8081/profelement/getdispoprof");
      const data = await response.json();
      setProfessors(data); // Professors: [{ code: 1, nameProf: "Dr. Ali Kamal" }]
    };
  
    const fetchModules = async () => {
      const response = await fetch("http://localhost:8081/profelement/getdispoelem");
      const data = await response.json();
      const modulesList = data.map((module) => ({
        code: module.code,       
        name: module.nemodule, 
        coef: module.coef,
        estValide: module.estValide,
        nemodule: module.nemodule,
        module: module.module,
      }));
      setModules(modulesList); 
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



  const deleteElementModule = (index) => {
    setTElementModule(TElementModule.filter((_, idx) => idx !== index));
  };

  const addElementModule = async () => {
    if (!moduleAdd || !professeurAdd) {
      alert("Veuillez sélectionner un module et un professeur.");
      return;
    }
  
    const selectedModule = modules.find((mod) => mod.name === moduleAdd);
    const selectedProfessor = professors.find((prof) => prof.nameProf === professeurAdd);
  
    if (!selectedModule || !selectedProfessor) {
      alert("Module ou professeur sélectionné non valide.");
      return;
    }
  
    // Prepare the payload
    const payload = {
      professeur: {
        code: selectedProfessor.code,
      },
      smodule: {
        code: selectedModule.code,
        coef: selectedModule.coef,
        description: "Default Description",
        nemodule:  selectedModule.nemodule,
        module: selectedModule.module
      },
    };
  
    try {
      const response = await fetch("http://localhost:8081/profelement/affectprofelement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur lors de l'affectation: ${response.statusText}`);
      }
  
      // Handle the response
      // const data = await response.json();
      // console.log("Affectation réussie:", data);
  
      // Update the local table to reflect the new addition
      setTElementModule((prev) => [
        ...prev,
        {
          module: selectedModule.name,
          description: "Description par défaut",
          professeur: selectedProfessor.nameProf,
        },
      ]);
  
      hideModalAdd();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Échec de l'affectation.");
    }
  };
  
  
  const sauvegarderChanges = async () => {
    try {
      const payload = {
        professeur: { code: professors.find((prof) => prof.nameProf === professeurModif)?.code },
        smodule: { 
          code: modules.find((mod) => mod.name === moduleModif)?.code,
          coefficient: 1 // Add coefficient or other values as needed
        }
      };
  
      const response = await fetch("http://localhost:8081/profelement/affectprofelement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update professor assignment");
      }
  
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
    } catch (error) {
      console.error("Error updating module:", error);
    }
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
                <option key={mod.code} value={mod.name}>
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
                <option key={prof.code} value={prof.nameProf}>
                  {prof.nameProf}
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
                <option key={mod.code} value={mod.name}>
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
                <option key={prof.code} value={prof.nameProf}>
                  {prof.nameProf}
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

import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./TableFiliere.css";
import { useEffect } from "react";

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


  const [filterNom, setFilterNom] = useState("");
  const [filterDescription, setfilterDescription] = useState("");
  const [filterNbrEtud, setfilterNbrEtud] = useState("");
  const [range, setRange] = useState({ min: 0, max: 0 });

  useEffect(() => {
    const minVal = Math.min(...TFiliere.map((filiere) => filiere.nbEtudiants));
    const maxVal = Math.max(...TFiliere.map((filiere) => filiere.nbEtudiants));
    setRange({ min: minVal, max: maxVal });
  }, [TFiliere]);

  const filteredFiliere = TFiliere.filter((filiere) => {
    const isInRange =
      (!range.min || filiere.nbEtudiants >= parseInt(range.min)) &&
      (!range.max || filiere.nbEtudiants <= parseInt(range.max));
    return (
      filiere.nom.toLowerCase().includes(filterNom.toLowerCase()) &&
      filiere.description.toLowerCase().includes(filterDescription.toLowerCase()) &&
      isInRange
    );
  });

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

  

  const handleNomChange = (e) => {
    setNomModif(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionModif(e.target.value);
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setRange((prev) => ({ ...prev, [name]: value }));
  };


  const handleNomaddChange = (e) => {
    setNomAdd(e.target.value); // Update the 'nonadd' state with the input value
  };
  
  const handleDescriptionaddChange = (e) => {
    setDescriptionAdd(e.target.value); // Update the 'prenomadd' state with the input value
  };
  
  // const handleNbEtudiantsaddChange = (e) => {
  //   setNbEtudiantsAdd(e.target.value); // Update the 'specialiteadd' state with the input value
  // };
  

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

  const highlightMatch = (text, filter) => {
    if (!filter) return text; // No filter, return original text
    const regex = new RegExp(`(${filter})`, 'gi'); // Match filter text
    return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap match
  };

  return (
    <>
      <button className="btn btn-info" onClick={showModalAdd}>
        Ajouter une filière
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
          <th>

<td>
  <div style={{ display: "flex", gap: "10px" }}>
    <input
      type="number"
      className="form-control"
      placeholder="Min Étudiants"
      name="min"
      value={range.min}
      onChange={handleRangeChange}
    />
    <input
      type="number"
      className="form-control"
      placeholder="Max Étudiants"
      name="max"
      value={range.max}
      onChange={handleRangeChange}
    />
  </div>
</td>



          </th>
          <th></th>
          <th></th>
        </tr>
          <tr>
            <th>Nom de la filière</th>
            <th>Description</th>
            <th>Nombre d'étudiants</th>
            <th>Modifier</th>
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiliere.map((filiere, index) => (
            <tr key={index}>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(filiere.nom, filterNom) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(filiere.description, filterDescription) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(filiere.nbEtudiants, filterNbrEtud) }}></td>
              <td>
                <button onClick={() => modifier(index)} className="btn btn-info">
                <i className="fa-solid fa-pen"></i>
                </button>
              </td>
              <td>
                <button onClick={() => deleteFiliere(index)} className="btn btn-danger">
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

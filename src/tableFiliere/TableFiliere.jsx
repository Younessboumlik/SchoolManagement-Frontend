import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./TableFiliere.css";

function FiliereTable() {
  const [TFiliere, setTFiliere] = useState([]);
  const [nomModif, setNomModif] = useState("");
  const [descriptionModif, setDescriptionModif] = useState("");
  const [nbEtudiantsModif, setNbEtudiantsModif] = useState("");
  const [indexModif, setIndexModif] = useState(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [nomAdd, setNomAdd] = useState("");
  const [descriptionAdd, setDescriptionAdd] = useState("");
  const [filterNom, setFilterNom] = useState("");
  const [filterDescription, setFilterDescription] = useState("");
  const [range, setRange] = useState({ min: 0, max: 0 });

  // Fetch data from API
  useEffect(() => {
    const fetchFiliere = async () => {
      try {
        const response = await fetch("http://localhost:8081/filiere/getfilieres");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        const mappedData = data.map((item) => ({
          id: item.filiereId,
          nom_filiere: item.nomFiliere,
          discription: item.description,
          nbEtudiants: item.studentCount,
        }));
        setTFiliere(mappedData);
      } catch (error) {
        console.error("Error fetching filieres:", error);
      }
    };

    fetchFiliere();
  }, []);

  // Filter the data based on the filters
  const filteredFiliere = (TFiliere || []).filter((filiere) => {
    if (!filiere || !filiere.nom_filiere || !filiere.discription) return false;

    const isInRange =
      (!range.min || filiere.nbEtudiants >= parseInt(range.min)) &&
      (!range.max || filiere.nbEtudiants <= parseInt(range.max));

    return (
      filiere.nom_filiere.toLowerCase().includes(filterNom.toLowerCase()) &&
      filiere.discription.toLowerCase().includes(filterDescription.toLowerCase()) &&
      isInRange
    );
  });

  const modifier = (index) => {
    setNomModif(TFiliere[index].nom_filiere);
    setDescriptionModif(TFiliere[index].discription);
    setNbEtudiantsModif(TFiliere[index].nbEtudiants);
    setIndexModif(index);
    showModal();
  };

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const showModalAdd = () => setIsModalAddOpen(true);
  const hideModalAdd = () => setIsModalAddOpen(false);

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setRange((prev) => ({ ...prev, [name]: value }));
  };

  const addFiliere = async (e) => {
    e.preventDefault();
  
    const newFiliere = {
      nom_filiere: nomAdd,
      discription: descriptionAdd,
    };
  
    try {
      const response = await fetch("http://localhost:8081/filiere/addfiliere", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFiliere),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add filiere");
      }
  
      // Fetch the updated list of filieres from the backend
      const updatedResponse = await fetch("http://localhost:8081/filiere/getfilieres");
      if (!updatedResponse.ok) {
        throw new Error("Failed to fetch updated filieres");
      }
      const updatedFilieres = await updatedResponse.json();
  
      // Map the updated filieres and set state
      const mappedData = updatedFilieres.map((item) => ({
        id: item.filiereId,
        nom_filiere: item.nomFiliere,
        discription: item.description,
        nbEtudiants: item.studentCount,
      }));
  
      setTFiliere(mappedData);
  
      // Reset form fields and close modal
      setNomAdd("");
      setDescriptionAdd("");
      hideModalAdd();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  
const updateFiliere = async (e) => {
  e.preventDefault();
  const updatedFiliere = {
    code: TFiliere[indexModif].id, // Include ID for update
    nom_filiere: nomModif, // Use snake_case
    discription: descriptionModif, // Use snake_case
    // studentCount: nbEtudiantsModif,
  };

  try {
    const response = await fetch("http://localhost:8081/filiere/updatefiliere", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFiliere),
    });

    if (!response.ok) {
      throw new Error(`Failed to update filiere, status: ${response.status}`);
    }

    // If the response has content, try to parse it as JSON
    let updatedData = {};
    if (response.status !== 204) {  // Status 204 means "No Content"
      const responseText = await response.text();  // Get raw text (it may not be JSON)
      if (responseText) {
        updatedData = JSON.parse(responseText);  // If there's text, try to parse it
      }
    }

    // If the response includes data, update the UI
    setTFiliere((prev) =>
      prev.map((filiere, index) =>
        index === indexModif
          ? {
              ...filiere,
              nom_filiere: updatedData.nom_filiere || nomModif, // Update with the response or fallback
              discription: updatedData.discription || descriptionModif, // Update with the response or fallback
              // nbEtudiants: updatedData.studentCount || nbEtudiantsModif,
            }
          : filiere
      )
    );

    // Close the modal after update
    hideModal();
  } catch (error) {
    console.error("Error:", error);
  }
};





  const deleteFiliere = async (index) => {
    const filiereToDelete = TFiliere[index];

    if (!filiereToDelete || !filiereToDelete.id) {
      console.error("ID is missing for the filiere to delete");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/filiere/deletefiliere", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: filiereToDelete.id }),
      });

      console.log(index);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete filiere: ${response.status}, ${errorText}`);
      }

      setTFiliere((prev) => prev.filter((_, idx) => idx !== index));
      console.log("Filiere deleted successfully");
    } catch (error) {
      console.error("Error deleting filiere:", error);
    }
  };

  const highlightMatch = (text, filter) => {
    if (!filter) return text;
    const regex = new RegExp(`(${filter})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
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
                onChange={(e) => setFilterDescription(e.target.value)}
              />
            </th>
            <th>
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
              <td dangerouslySetInnerHTML={{ __html: highlightMatch(filiere.nom_filiere, filterNom) }}></td>
              <td dangerouslySetInnerHTML={{ __html: highlightMatch(filiere.discription, filterDescription) }}></td>
              <td>{filiere.nbEtudiants}</td>
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

      <Modal show={isModalOpen} onHide={hideModal}>
        <form onSubmit={updateFiliere}>
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
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                className="form-control"
                value={descriptionModif}
                onChange={(e) => setDescriptionModif(e.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={hideModal}>
              Fermer
            </button>
            <button type="submit" className="btn btn-primary">
              Sauvegarder
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal show={isModalAddOpen} onHide={hideModalAdd}>
        <form onSubmit={addFiliere}>
          <Modal.Header closeButton>
            <Modal.Title>Ajouter une filière</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label>Nom</label>
              <input
                className="form-control"
                value={nomAdd}
                onChange={(e) => setNomAdd(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                className="form-control"
                value={descriptionAdd}
                onChange={(e) => setDescriptionAdd(e.target.value)}
                required
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-secondary" onClick={hideModalAdd}>
              Fermer
            </button>
            <button type="submit" className="btn btn-primary">
              Ajouter
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default FiliereTable;

import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableModEval.css";

function ModEvalTable() {
    const [TModEval, setTModEval] = useState([]);
    const [nomModif, setNomModif] = useState("");
    const [descriptionModif, setDescriptionModif] = useState("");
    const [indexModif, setIndexModif] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [nomAdd, setNomAdd] = useState("");
    const [descriptionAdd, setDescriptionAdd] = useState("");
    const [filterNom, setFilterNom] = useState("");
    const [filterDescription, setfilterDescription] = useState("");

    useEffect(() => {
        fetchModalites();
    }, []);

    const fetchModalites = async () => {
        try {
            const response = await fetch("http://localhost:8081/modalite/getmodalites");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTModEval(data);
        } catch (error) {
            console.error("Error fetching modalites:", error);
        }
    };

    const filteredModEval = TModEval.filter((modeeval) => {
      if (!modeeval || !modeeval.nom || !modeeval.description) {
        return false;
      }
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
        setNomAdd(e.target.value);
    };

    const handleDescriptionaddChange = (e) => {
        setDescriptionAdd(e.target.value);
    };

     const modifyModalite = async () => {
        try {
          const modaliteToUpdate = {
            ...TModEval[indexModif],
            nom: nomModif,
            description: descriptionModif,
          };
          const response = await fetch("http://localhost:8081/modalite/modifymodalite", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(modaliteToUpdate),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          fetchModalites(); // Refresh the list
          hideModal();
        } catch (error) {
          console.error("Error updating modalite:", error);
        }
      };

    const deleteModEval = async (index) => {
        try {
             const modaliteToDelete = TModEval[index];

            const response = await fetch(`http://localhost:8081/modalite/deletemodalite/${modaliteToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fetchModalites(); // Refresh the list
        } catch (error) {
            console.error("Error deleting modalite:", error);
        }
    };

    const addModEval = async () => {
      try {
        const newModalite = {
          nom: nomAdd,
          description: descriptionAdd,
        };
        const response = await fetch("http://localhost:8081/modalite/addmodalite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newModalite),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchModalites();
        hideModalAdd();

      } catch (error) {
        console.error("Error adding modalite:", error);
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
                    <tr key={modeeval.id}>
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
                            onChange={handleNomChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            className="form-control"
                            value={descriptionModif}
                            onChange={handleDescriptionChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={hideModal}>
                        Fermer
                    </button>
                    <button className="btn btn-primary" onClick={modifyModalite}>
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
                            onChange={handleNomaddChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input
                            className="form-control"
                            onChange={handleDescriptionaddChange}
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
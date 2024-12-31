import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableProfElement.css";
import Select from 'react-select';

function ElementModuleTable() {
    const [TElementModule, setTElementModule] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [modules, setModules] = useState([]);

    const [moduleModif, setModuleModif] = useState("");
    const [professeurModif, setProfesseurModif] = useState(null);
    const [indexModif, setIndexModif] = useState(-1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);

    const [moduleAdd, setModuleAdd] = useState(null);
    const [professeurAdd, setProfesseurAdd] = useState(null);

    const [filterModule, setFilterModule] = useState("");
    const [filterProfesseur, setFilterProfesseur] = useState("");
    const [filterDescription, setFilterDescription] = useState("");

    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

       const handleError = (message) => {
        setErrorMessage(message);
        setErrorModalOpen(true);
      };

    const handleCloseErrorModal = () => {
        setErrorModalOpen(false);
        setErrorMessage('');
    };



    const fetchData = async () => {
        try {
            const profResponse = await fetch("http://localhost:8081/profelement/getdispoprof");
            const profData = await profResponse.json();
            setProfessors(profData.map(prof => ({
              value: prof.code,
                label: prof.nameProf
            })));

            const moduleResponse = await fetch("http://localhost:8081/profelement/getdispoelem");
             const moduleData = await moduleResponse.json();
            const mappedModules = moduleData.map((module) => ({
                value: module.code,
                label: module.nemodule,
                coef: module.coef,
                estValide: module.estValide,
                nemodule: module.nemodule,
                 module: module.module,
            }));
            console.log("Modules Fetched:", mappedModules);
            setModules(mappedModules);

            const assignmentResponse = await fetch("http://localhost:8081/profelement/showaffectprofelement");
            const assignmentData = await assignmentResponse.json();

            const transformedData = assignmentData.map(item => ({
                module: item.nemodule,
                coef: item.coef,
                professeur: item.prof ? `${item.prof.nom} ${item.prof.prenom}` : '',
                code: item.code,
                profCode: item.prof?.code
            }));
             console.log("Assignments Fetched:", transformedData);
            setTElementModule(transformedData);
        } catch (error) {
            console.error("Error fetching data:", error);
            handleError("Échec de la récupération des données initiales. Veuillez réessayer plus tard.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

  const filteredElementModule = TElementModule.filter((elementModule) => {
    return (
      elementModule?.module?.toLowerCase().includes(filterModule?.toLowerCase() || '') &&
      elementModule?.professeur?.toLowerCase().includes(filterProfesseur?.toLowerCase() || '') &&
      String(elementModule?.coef || '').toLowerCase().includes(filterDescription?.toLowerCase() || '')
    );
  });


   const modifier = (index) => {
       console.log("Setting moduleModif to:", TElementModule[index].module);
        setModuleModif(TElementModule[index].module);
       setProfesseurModif({ label: TElementModule[index].professeur, value: TElementModule[index].profCode });
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
        setModuleAdd(null);
        setProfesseurAdd(null);
    };

     const deleteElementModule = async (index) => {
      try {
           const elementToDelete = TElementModule[index];
              if(!elementToDelete) {
                  handleError("L'élément à supprimer n'a pas été trouvé.");
                   return;
              }
            const response = await fetch("http://localhost:8081/profelement/deleteaffectprofelement", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: elementToDelete.code
                })
            });

            if (!response.ok) {
                throw new Error("Échec de la suppression du module");
            }
            const updatedTElementModule = TElementModule.filter((_, idx) => idx !== index);
            setTElementModule(updatedTElementModule);

            fetchData(); // Refetch data to update the table
        } catch (error) {
          console.error("Error deleting module:", error);
          handleError(`Échec de la suppression du module: ${error.message}.`);
        }
    };

   const addElementModule = async () => {
     if (!moduleAdd) {
         handleError("Veuillez sélectionner un module.");
          return;
          }

      if (!professeurAdd) {
         handleError("Veuillez sélectionner un professeur.");
          return;
      }
       try {
        const selectedModule = modules.find((mod) => mod.value === moduleAdd.value);
       const selectedProfessor = professors.find((prof) => prof.value === professeurAdd.value);

       if (!selectedModule || !selectedProfessor) {
          handleError("Module ou professeur sélectionné non valide");
          return;
     }

         const payload = {
             professeur: {
                 code: selectedProfessor.value,
              },
           smodule: {
                 code: selectedModule.value,
                coef: selectedModule.coef,
                  description: "Default Description",
                nemodule: selectedModule.nemodule,
                   module: {
                      code:selectedModule.value
                       }
                },
         };
             const response = await fetch("http://localhost:8081/profelement/affectprofelement", {
                 method: "POST",
                headers: {
                   "Content-Type": "application/json",
                },
                 body: JSON.stringify(payload),
              });

         if (!response.ok) {
           const errorData = await response.json(); //try to parse the error message
             let errorMessage = "Échec de l'ajout du module";
                  if(errorData && errorData.message) {
                    errorMessage +=  ` Détails: ${errorData.message}`
                 } else if(errorData && typeof errorData === 'string') {
                      errorMessage +=  ` Détails: ${errorData}`
                     }

              throw new Error(errorMessage)
           }
         hideModalAdd();
       fetchData();
     } catch (error) {
        console.error("Erreur:", error);
         handleError(`Échec de l'ajout du module: ${error.message}`);
        }
    };

  const sauvegarderChanges = async () => {
      try {
           const currentElement = TElementModule[indexModif];
          
           if (!currentElement) {
             handleError("Élément actuel introuvable. Veuillez actualiser la page.");
             return;
         }

      const selectedProfessor = professors.find((prof) => prof.value === professeurModif.value);

        if (!selectedProfessor) {
                handleError("Le professeur sélectionné n'a pas été trouvé.");
              return;
           }
         const payload = {
            professeur: {
                code: selectedProfessor.value
            },
           smodule: {
                code: currentElement.code,
                coef: currentElement.coef,
                 coefficient: currentElement.coef,
                nemodule: currentElement.module,
                description: "Default Description",
                 module: {
                      code: currentElement.code
                }
            }
          };
        console.log("Payload being sent:", payload);

       const response = await fetch("http://localhost:8081/profelement/affectprofelement", {
         method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify(payload),
      });

      if (!response.ok) {
          const errorData = await response.json();
              let errorMessage = "Échec de la mise à jour de l'affectation du professeur";
            if (errorData && errorData.message) {
                  errorMessage += ` Détails: ${errorData.message}`
                } else if(errorData && typeof errorData === 'string') {
                      errorMessage += ` Détails: ${errorData}`
              }
             throw new Error(errorMessage);
       }

       hideModal();
       fetchData();
     } catch (error) {
     console.error("Error updating module:", error);
        handleError(`Échec de la mise à jour de l'affectation du professeur: ${error.message}.`);
        }
    };


    return (
    <div className="container">
             <button className="btn btn-info btn-add" onClick={showModalAdd}>
                Affecter des éléments de module aux professeurs
            </button>
           <div className="filter-container">
                <input
                        type="text"
                       className="form-control-filter"
                        placeholder="Filtrer Element"
                       value={filterModule}
                      onChange={(e) => setFilterModule(e.target.value)}
                    />
                     <input
                      type="text"
                        className="form-control-filter"
                        placeholder="Filtrer Coefficient"
                      value={filterDescription}
                      onChange={(e) => setFilterDescription(e.target.value)}
                 />
                    <input
                         type="text"
                        className="form-control-filter"
                        placeholder="Filtrer Professeur"
                      value={filterProfesseur}
                       onChange={(e) => setFilterProfesseur(e.target.value)}
                   />
           </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Element de Module</th>
                        <th>Coefficient</th>
                        <th>Professeur</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredElementModule.map((elementModule, index) => (
                        <tr key={index}>
                            <td>{elementModule.module}</td>
                            <td>{elementModule.coef}</td>
                            <td>{elementModule.professeur}</td>
                            <td>
                                <button onClick={() => modifier(index)} className="btn btn-info">
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button onClick={() => deleteElementModule(index)} className="btn btn-danger">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

             <Modal show={errorModalOpen} onHide={handleCloseErrorModal}>
                <Modal.Header className="modal-header-error" closeButton>
                    <Modal.Title>Erreur</Modal.Title>
                 </Modal.Header>
                <Modal.Body  className="modal-body-error">
                     {errorMessage}
                  </Modal.Body>
          </Modal>

             <Modal show={isModalOpen} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier un Élément de Module</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                         <label>Module</label>
                        <input
                        type="text"
                        className="form-control"
                        value={moduleModif}
                        readOnly //make it read only and disable selection
                      />
                    </div>
                    <div className="form-group">
                        <label>Professeur</label>
                         <Select
                                      className="form-control"
                                      value={professeurModif}
                                      onChange={(selectedOption) => setProfesseurModif(selectedOption)}
                                      options={professors}
                                      isSearchable
                                      placeholder="Choisir un Professeur"
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

            <Modal show={isModalAddOpen} onHide={hideModalAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Affecter des éléments de module aux professeurs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                         <label>Module</label>
                           <Select
                                      className="form-control"
                                      value={moduleAdd}
                                      onChange={(selectedOption) => setModuleAdd(selectedOption)}
                                      options={modules}
                                      isSearchable
                                      placeholder="Choisir un Module"
                                    />
                    </div>
                    <div className="form-group">
                         <label>Professeur</label>
                           <Select
                                      className="form-control"
                                      value={professeurAdd}
                                      onChange={(selectedOption) => setProfesseurAdd(selectedOption)}
                                      options={professors}
                                      isSearchable
                                      placeholder="Choisir un Professeur"
                                    />
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
      </div>
    );
}

export default ElementModuleTable;
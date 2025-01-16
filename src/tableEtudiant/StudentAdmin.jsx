import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from "react-bootstrap/Modal";
import './studentManagement.css';

function StudentAdmin() {
    const [etudiants, setEtudiants] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState(null);
    const [selectedSemestre, setSelectedSemestre] = useState(null);
    const [newEtudiants, setNewEtudiants] = useState([{ nom: '', prenom: '' }]);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [filieres, setFilieres] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [filterNom, setFilterNom] = useState("");
    const [filterPrenom, setFilterPrenom] = useState("");

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
            const filiereResponse = await fetch("http://localhost:8081/filiere/getfilieres");
            const filiereData = await filiereResponse.json();
            setFilieres(filiereData.map(filiere => ({
                value: filiere.filiereId,
                label: filiere.nomFiliere
            })));

            if (selectedFiliere) {
                const semestreResponse = await fetch("http://localhost:8081/semestre/getsemestres");
                const semestreData = await semestreResponse.json();
                setSemestres(semestreData.map(semestre => ({
                    value: semestre.code,
                    label: semestre.nom
                })));
            }

            if (selectedFiliere && selectedSemestre) {
                const payload = {
                    semestre: {
                        code: selectedSemestre.value
                    },
                    filieredto: {
                        filiereId: selectedFiliere.value
                    }
                };

                const response = await fetch("http://localhost:8081/etudiant/getetudiants", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (response.ok) {
                    if (response.status === 204) {
                        setEtudiants([]);
                        console.log("No students found for the selected filter.");
                    } else {
                        try {
                            const etudiantData = await response.json();
                            if (etudiantData && etudiantData.length > 0) {
                                setEtudiants(etudiantData);
                            } else {
                                setEtudiants([]);
                                console.log("No students found for the selected filter.");
                            }
                        } catch (jsonError) {
                            setEtudiants([]);
                            console.log("No data found or invalid json");
                        }
                    }
                } else if (response.status === 500) {
                    setEtudiants([]);
                    console.log("Error 500.");
                    handleError("Erreur côté serveur, veuillez réessayer plus tard.");
                } else {
                    throw new Error("Error fetching students data");
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            handleError("Échec de la récupération des données initiales. Veuillez réessayer plus tard.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedFiliere, selectedSemestre]);

    const filteredEtudiants = etudiants.filter((etudiant) => {
        const nomFilter = filterNom.toLowerCase();
        const prenomFilter = filterPrenom.toLowerCase();
        return (
            etudiant?.nom?.toLowerCase().includes(nomFilter) &&
            etudiant?.prenom?.toLowerCase().includes(prenomFilter)
        );
    });

    const handleFiliereSelect = (selectedOption) => {
        setSelectedFiliere(selectedOption);
        setSelectedSemestre(null);
        setNewEtudiants([{ nom: '', prenom: '' }]);
    };

    const handleSemestreSelect = (selectedOption) => {
        setSelectedSemestre(selectedOption);
        setNewEtudiants([{ nom: '', prenom: '' }]);
    };

    const handleAddEtudiantRow = () => {
        if (newEtudiants.some(etudiant => etudiant.nom === '' || etudiant.prenom === '')) {
            handleError("Veuillez remplir tous les champs de l'étudiant avant d'ajouter une nouvelle ligne.");
            return;
        }
        setNewEtudiants([...newEtudiants, { nom: '', prenom: '' }]);
    };

    const handleNewEtudiantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedNewEtudiants = [...newEtudiants];
        updatedNewEtudiants[index][name] = value;
        setNewEtudiants(updatedNewEtudiants);
    };

    const deleteEtudiant = async (etudiantId) => {
        try {
            const response = await fetch("http://localhost:8081/etudiant/deleteetudiant", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: etudiantId
                })
            });

            if (!response.ok) {
                throw new Error("Échec de la suppression de l'étudiant");
            }

            const updatedEtudiants = etudiants.filter(etudiant => etudiant.id !== etudiantId);
            setEtudiants(updatedEtudiants);
        } catch (error) {
            console.error("Error deleting student:", error);
            handleError(`Échec de la suppression de l'étudiant : ${error.message}.`);
        }
    };

    const handleUpdateEtudiant = async (etudiant) => {
        try {
            const response = await fetch("http://localhost:8081/etudiant/updateetudiant", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(etudiant),
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = "Échec de la modification de l'étudiant";
                if (errorData && errorData.message) {
                    errorMessage += ` Détails: ${errorData.message}`;
                } else if (errorData && typeof errorData === 'string') {
                    errorMessage += ` Détails: ${errorData}`;
                }
                throw new Error(errorMessage);
            }

            const updatedEtudiants = etudiants.map((e) => e.id === etudiant.id ? { ...etudiant, isEditing: false } : e);
            setEtudiants(updatedEtudiants);
        } catch (error) {
            console.error("Error updating student:", error);
            handleError(`Échec de la modification de l'étudiant : ${error.message}.`);
        }
    };

    const handleSaveAllEtudiants = async () => {
        if (newEtudiants.length === 0 || newEtudiants.some(etudiant => etudiant.nom === '' || etudiant.prenom === '')) {
            handleError("Aucun nouvel étudiant à enregistrer ou un champ est vide.");
            return;
        }

        try {
            const params = new URLSearchParams({
                filiereId: selectedFiliere.value,
                semestreId: selectedSemestre.value
            });

            const response = await fetch(`http://localhost:8081/etudiant/addetudiants?${params}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newEtudiants),
            });

            if (!response.ok) {
                if (response.status === 500) {
                    handleError("Veuillez ajouter un sous-module pour les modules de cette filière et ce semestre.");
                } else {
                    const errorData = await response.json();
                    let errorMessage = "Échec de l'ajout des étudiants";
                    if (errorData && errorData.message) {
                        errorMessage += ` Détails: ${errorData.message}`;
                    } else if (errorData && typeof errorData === 'string') {
                        errorMessage += ` Détails: ${errorData}`;
                    }
                    throw new Error(errorMessage);
                }
            }

            setNewEtudiants([{ nom: '', prenom: '' }]);
            fetchData();
        } catch (error) {
            console.error("Erreur:", error);
            handleError(`Échec de l'ajout des étudiants : ${error.message}`);
        }
    };

    const handleDeleteNewEtudiantRow = (indexToDelete) => {
        const updatedEtudiants = newEtudiants.filter((_, index) => index !== indexToDelete);
        setNewEtudiants(updatedEtudiants);
    };

    return (
        <div className="student-admin-container wide-form">
            <h2>Gestion des Étudiants</h2>
            <div className="form-group">
                <label>Filière</label>
                <Select
                    className="form-control"
                    value={selectedFiliere}
                    onChange={handleFiliereSelect}
                    options={filieres}
                    isSearchable
                    placeholder="Choisir une Filière"
                />
            </div>

            {selectedFiliere && (
                <div className="form-group">
                    <label>Semestre</label>
                    <Select
                        className="form-control"
                        value={selectedSemestre}
                        onChange={handleSemestreSelect}
                        options={semestres}
                        isSearchable
                        placeholder="Choisir un Semestre"
                    />
                </div>
            )}

            {selectedFiliere && selectedSemestre && (
                <>
                    <div className="filter-container">
                        <input
                            type="text"
                            className="form-control-filter"
                            placeholder="Filtrer par Nom"
                            value={filterNom}
                            onChange={(e) => setFilterNom(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control-filter"
                            placeholder="Filtrer par Prénom"
                            value={filterPrenom}
                            onChange={(e) => setFilterPrenom(e.target.value)}
                        />
                    </div>

                    <button className="btn btn-primary" onClick={handleSaveAllEtudiants} disabled={newEtudiants.length === 0 || newEtudiants.some(etudiant => etudiant.nom === '' || etudiant.prenom === '')} >
                        Sauvegarder
                    </button>
                    <table className="table wide-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEtudiants.map((etudiant) => (
                                <tr key={etudiant.id}>
                                    <td>{etudiant.id}</td>
                                    <td>
                                        {etudiant.isEditing ? (
                                            <input
                                                type="text"
                                                className="form-control input-wide"
                                                value={etudiant.nom}
                                                onChange={(e) => {
                                                    const updatedEtudiant = { ...etudiant, nom: e.target.value };
                                                    setEtudiants(
                                                        etudiants.map((s) =>
                                                            s.id === etudiant.id ? updatedEtudiant : s
                                                        )
                                                    );
                                                }}
                                            />
                                        ) : (
                                            etudiant.nom
                                        )}
                                    </td>
                                    <td>
                                        {etudiant.isEditing ? (
                                            <input
                                                type="text"
                                                className="form-control input-wide"
                                                value={etudiant.prenom}
                                                onChange={(e) => {
                                                    const updatedEtudiant = { ...etudiant, prenom: e.target.value };
                                                    setEtudiants(
                                                        etudiants.map((s) =>
                                                            s.id === etudiant.id ? updatedEtudiant : s
                                                        )
                                                    );
                                                }}
                                            />
                                        ) : (
                                            etudiant.prenom
                                        )}
                                    </td>
                                    <td>
                                        {etudiant.isEditing ? (
                                            <button
                                                onClick={async () => {
                                                    await handleUpdateEtudiant(etudiant);
                                                }}
                                                className="btn btn-success"
                                            >
                                                <i className="fa-solid fa-check"></i>
                                            </button>
                                        ) : (
                                            <>
                                                <button onClick={() => setEtudiants(etudiants.map((e) => e.id === etudiant.id ? { ...e, isEditing: true } : e))} className="btn btn-primary">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button onClick={() => deleteEtudiant(etudiant.id)} className="btn btn-danger">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {newEtudiants.map((newEtudiant, index) => (
                                <tr key={`new-${index}`}>
                                    <td>-</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control input-wide"
                                            placeholder="Nom"
                                            name="nom"
                                            value={newEtudiant.nom}
                                            onChange={(e) => handleNewEtudiantChange(index, e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control input-wide"
                                            placeholder="Prénom"
                                            name="prenom"
                                            value={newEtudiant.prenom}
                                            onChange={(e) => handleNewEtudiantChange(index, e)}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleDeleteNewEtudiantRow(index)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="4">
                                    <button className="btn btn-secondary" onClick={handleAddEtudiantRow}>
                                        +
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            )}

            <Modal show={errorModalOpen} onHide={handleCloseErrorModal}>
                <Modal.Header className="modal-header-error" closeButton>
                    <Modal.Title>Erreur</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body-error">
                    {errorMessage}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default StudentAdmin;
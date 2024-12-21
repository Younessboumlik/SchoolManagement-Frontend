
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

function ModulefTable() {
  const [Tmodules, setTmodules] = useState([
    { nommodule: "mathematique", codemodule: 1, filiere: "science math", semestre: "s1" },
    { nommodule: "physique", codemodule: 2, filiere: "science physique", semestre: "s2" }
  ]);

  const [Telementdemodule, setTelementdemodule] = useState({
    1: [
      { code: 1, nomelem: "algebre", coef: 0.25 },
      { code: 2, nomelem: "analyse", coef: 0.75 ,modalite :
        [
       {code :1 ,nom:"cc1",description:"controle commun1",coef:0.15},
       {code :2 ,nom:"cc1",description:"controle commun 2",coef:0.15},
       {code :3 ,nom:"tp",description:"travaus pratique",coef:0.2},
       {code :4 ,nom:"projet",description:"projet",coef:0.3},
       {code :5 ,nom:"pr",description:"presentation",coef:0.2},
    ]}
    ],
    2: [{ code: 1, nomelem: "mecanique", coef: 1 ,modalite :
        [
       {code :1 ,nom:"cc1",description:"controle commun1",coef:0.15},
       {code :2 ,nom:"cc1",description:"controle commun 2",coef:0.15},
       {code :3 ,nom:"tp",description:"travaus pratique",coef:0.2},
       {code :4 ,nom:"projet",description:"projet",coef:0.3},
       {code :5 ,nom:"pr",description:"presentation",coef:0.2},
    ]}]
  });

  const [indexrender, setIndexrender] = useState(null);
  const [indexrendermEval, setIndexrendermEval] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isElementModalOpen, setIsElementModalOpen] = useState(false);
  const [isElModaliteopen, setIstModaliteopen] = useState(false);

  const [currentModule, setCurrentModule] = useState(null);
  const [newModule, setNewModule] = useState({ nommodule: "", filiere: "", semestre: "" });
  const [newElement, setNewElement] = useState({ nomelem: "", coef: "", codemodule: null, code: null ,modalite:[]});
  const [newModalite, setNewModalite] = useState({ code : null , nom: "", description: "", coef: null });
  const [codemodule, setCodemodule] = useState(null); // ID du module sélectionné
  const [indexelem, setIndexelem] = useState(null);   // Index de l'élément sélectionné
  const [indexmodal, setIndexmodal] = useState(null); // Index de la modalité sélectionnée


  const filiereOptions = ["science math", "science physique", "informatique", "biologie"];

  const toggleRowmodalite  = (i)=>{
    if (indexrendermEval === null){
        setIndexrendermEval(i)
    }
    else{
     if (indexrendermEval == i){
        setIndexrendermEval(null)
     }
     else {
        setIndexrendermEval(i)  
     }
    }
 }
 const toggleRowElements = (i)=>{
    if ( indexrender  === null){
     setIndexrender(i)
    }
    else{
     if ( indexrender  == i){
       setIndexrender(null)
     }
     else {
         setIndexrender(i)
      
     }
     
    }
 }
  const openModuleModal = (module = null) => {
    setCurrentModule(module);
    setNewModule(module || { nommodule: "", filiere: "", semestre: "" });
    setIsModalOpen(true);
  };

  const openElementModal = (codemodule, element = null) => {
    setNewElement(element || { nomelem: "", coef: "", codemodule });
    setIsElementModalOpen(true);
  };

  const closeModuleModal = () => setIsModalOpen(false);
  const closeElementModal = () => setIsElementModalOpen(false);

  const handleModuleChange = (field, value) => {
    setNewModule((prev) => ({ ...prev, [field]: value }));
  };

  const handleElementChange = (field, value) => {
    setNewElement((prev) => ({ ...prev, [field]: value }));
  };
  const handleModaliteChange = (field, value) => {
    setNewModalite((prev) => ({ ...prev, [field]: value }));
  };

  const saveModule = () => {
    if (currentModule) {
      setTmodules((prev) =>
        prev.map((module) =>
          module.codemodule === currentModule.codemodule ? { ...module, ...newModule } : module
        )
      );
    } else {
      const newCodemodule = Math.max(...Tmodules.map((m) => m.codemodule)) + 1;
      setTmodules((prev) => [...prev, { ...newModule, codemodule: newCodemodule }]);
    }
    closeModuleModal();
  };

  const saveElement = () => {
    if (newElement.code) {
      // Update existing element
      setTelementdemodule((prev) => ({
        ...prev,
        [newElement.code]: prev[newElement.code].map((elem) =>
          elem.code === newElement.code ? { ...elem, ...newElement } : elem
        ),
      }));
    } else {
      // Add new element
      setTelementdemodule((prev) => ({
        ...prev,
        [newElement.codemodule]: [
          ...(prev[newElement.codemodule] || []),
          { ...newElement, code: Date.now() },
        ],
      }));
    }
    closeElementModal();
  };

  const deleteModule = (codemodule) => {
    setTmodules((prev) => prev.filter((module) => module.codemodule !== codemodule));
    setTelementdemodule((prev) => {
      const copy = { ...prev };
      delete copy[codemodule];
      return copy;
    });
  };

  const deleteElement = (codemodule, code) => {
    setTelementdemodule((prev) => ({
      ...prev,
      [codemodule]: prev[codemodule].filter((el) => el.code !== code),
    }));
  };
  const modifiermodalite = (codemod,indexelem,indexmodal)=>{
    console.log(codemod,indexelem,indexmodal)
    setNewModalite(Telementdemodule[codemod][indexelem].modalite[indexmodal])
    setCodemodule(codemod)
    setIndexelem(indexelem)
    setIndexmodal(indexmodal)
    openModaliteModal()
  }
   const ajoutermodalite = (codemod,indexelem)=>{
    console.log(codemod,indexelem)
    setCodemodule(codemod)
    setIndexelem(indexelem)
    openModaliteModal()
  }
  const saveModalite = () => {
    setTelementdemodule((prev) => {
      const elements = prev[codemodule] || [];
      const updatedElements = elements.map((elem, elemIndex) => {
        if (elemIndex === indexelem) {
          // Vérifie si l'élément a déjà des modalités
          const updatedModalite = elem.modalite
            ? elem.modalite.map((modal, modalIndex) => 
                modalIndex === indexmodal ? { ...modal, ...newModalite } : modal
              )
            : [];
  
          // Si indexmodal est -1, ajoute une nouvelle modalité
          if (newModalite.code === null) {
            updatedModalite.push({ ...newModalite, code: Date.now() });
          }
  
          return { ...elem, modalite: updatedModalite };
        }
        return elem;
      });
      setNewModalite({code :null , nom: "", description: "", coef: null})
      setCodemodule(null)
      setIndexelem(null)
      return { ...prev, [codemodule]: updatedElements };
    });
    hidelodaliteModal()
  };
  const deleteModalite = (codemodule, indexelem, indexmodal) => {
   let coefadded = Telementdemodule[codemodule][indexelem].modalite[indexmodal].coef/(Telementdemodule[codemodule][indexelem].modalite.length-1)
   setTelementdemodule((prev) => {
      const elements = prev[codemodule] || [];
      const updatedElements = elements.map((elem, elemIndex) => {
        if (elemIndex === indexelem) {
          // Supprimer la modalité à l'index spécifié
          var updatedModalite = elem.modalite
            ? elem.modalite.filter((_, modalIndex) => modalIndex !== indexmodal)
            : [];
           updatedModalite =  updatedModalite.map((modal) =>{
                return {...modal,coef:(modal.coef+coefadded)}
              })
          return { ...elem, modalite: updatedModalite };
        }
        return elem;
      });
  
      return { ...prev, [codemodule]: updatedElements };
    });

  };
  
  
  const openModaliteModal = ()=>{
    setIstModaliteopen(true)
  }
 const hidelodaliteModal = ()=>{
        setIstModaliteopen(false)
  }

  return (
    <>
      <button className="btn btn-success" onClick={() => openModuleModal()}>
        Ajouter un module
      </button>
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Filière</th>
            <th>Semestre</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Add Element</th>
            <th>See Elements</th>
          </tr>
        </thead>
        <tbody>
          {Tmodules.map((modu, indexmod) => (
            <React.Fragment key={modu.codemodule}>
              <tr>
                <td>{modu.nommodule}</td>
                <td>{modu.filiere}</td>
                <td>{modu.semestre}</td>
                <td>
                  <button className="btn btn-info" onClick={() => openModuleModal(modu)}>
                    Modifier
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteModule(modu.codemodule)}>
                    Supprimer
                  </button>
                </td>
                <td>
                  <button className="btn btn-info" onClick={() => openElementModal(modu.codemodule)}>
                    Ajouter Élément
                  </button>
                </td>
                <td>
                  <button className="btn btn-secondary" onClick={() => toggleRowElements(indexmod)}>
                    {indexrender === indexmod ? "Masquer" : "Afficher"}
                  </button>
                </td>
              </tr>
              {indexrender === indexmod && (
                <tr>
                  <td colSpan="7">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Coefficient</th>
                          <th>Edit</th>
                          <th>Delete</th>
                          <th>voir les mod</th>
                          <th>ajouter modalite</th>

                        </tr>
                      </thead>
                      <tbody>
                        {(Telementdemodule[modu.codemodule] || []).map((elemodu,indexelemmod) => (
                          <React.Fragment key={modu.codemodule}>
                          <tr key={elemodu.code}>
                            <td>{elemodu.nomelem}</td>
                            <td>{elemodu.coef}</td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() => openElementModal(modu.codemodule, elemodu)}
                              >
                                Modifier
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteElement(modu.codemodule, elemodu.code)}
                              >
                                Supprimer
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-dark"
                                onClick={() => toggleRowmodalite(elemodu.code)}
                              >
                                voir
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-success"
                                onClick={() => ajoutermodalite(modu.codemodule,indexelemmod)}
                              >
                                ajouter
                              </button>
                            </td>
                          </tr>
                          {indexrendermEval === elemodu.code && (
                <tr>
                  <td colSpan="7">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>description</th>
                          <th>coef</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(elemodu.modalite || []).map((moda,indexmoda) => (
                          <tr key={moda.code}>
                            <td>{moda.nom}</td>
                            <td>{moda.description}</td>
                            <td>{moda.coef}</td>
                            <td>
                              <button
                                className="btn btn-warning"
                                onClick={() => {modifiermodalite(modu.codemodule,indexelemmod,indexmoda)}}
                              >
                                Modifier
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteModalite(modu.codemodule,indexelemmod,indexmoda)}
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
                        )}
                      </React.Fragment>
              ))}
              </tbody>
              </table>
              </td>
              </tr>)}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Module Modal */}
      <Modal show={isModalOpen} onHide={closeModuleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentModule ? "Modifier le Module" : "Ajouter un Module"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nom du module</label>
            <input
              className="form-control"
              value={newModule.nommodule}
              onChange={(e) => handleModuleChange("nommodule", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Filière</label>
            <select
              className="form-control"
              value={newModule.filiere}
              onChange={(e) => handleModuleChange("filiere", e.target.value)}
            >
              <option value="">Sélectionner une filière</option>
              {filiereOptions.map((filiere, index) => (
                <option key={index} value={filiere}>
                  {filiere}
                </option> 
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Semestre</label>
            <input
              className="form-control"
              value={newModule.semestre}
              onChange={(e) => handleModuleChange("semestre", e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeModuleModal}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={saveModule}>
            {currentModule ? "Sauvegarder" : "Ajouter"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Element Modal */}
      <Modal show={isElementModalOpen} onHide={closeElementModal}>
        <Modal.Header closeButton>
          <Modal.Title>{newElement.code ? "Modifier l'Élément" : "Ajouter un Élément"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nom de l'Élément</label>
            <input
              className="form-control"
              value={newElement.nomelem}
              onChange={(e) => handleElementChange("nomelem", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Coefficient</label>
            <input
              className="form-control"
              type="number"
              value={newElement.coef}
              onChange={(e) => handleElementChange("coef", e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={closeElementModal}>
            Annuler
          </button>
          <button className="btn btn-primary" onClick={saveElement}>
            {newElement.code ? "Sauvegarder" : "Ajouter"}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={isElModaliteopen} onHide={setIstModaliteopen}>
  <Modal.Header closeButton>
    <Modal.Title>{newModalite.code ? "Modifier Modalité" : "Ajouter Modalité"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="form-group">
      <label>Nom</label>
      <input
        className="form-control"
        value={newModalite.nomelem}
        onChange={(e) => handleModaliteChange("nom", e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Description</label>
      <input
        className="form-control"
        value={newModalite.description}
        onChange={(e) => handleModaliteChange("description", e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Coefficient</label>
      <input
        className="form-control"
        type="number"
        value={newModalite.coef}
        onChange={(e) => handleModaliteChange("coef", e.target.value)}
      />
    </div>
  </Modal.Body>
  <Modal.Footer>
    <button className="btn btn-secondary" onClick={closeElementModal}>
      Annuler
    </button>
    <button
      className="btn btn-primary"
      onClick={() =>
        saveModalite()
      }
    >
      {newModalite.code ? "Sauvegarder" : "Ajouter"}
    </button>
  </Modal.Footer>
</Modal>

    </>
  );
}

export default ModulefTable;
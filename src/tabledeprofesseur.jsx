import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./tableprofstyle.css"
import Accordion from 'react-bootstrap/Accordion';
// Set the app element for accessibility
// ReactModal.setAppElement("#root");
import emailjs from "emailjs-com"
import { Await } from "react-router-dom";

function ProfTable() {
  const [TProfesseur, setTProfesseur] = useState([
    { code : 12 ,nom: "abdellah", prenom: "boulidam", specialite: "Math", email: "abdellah@gmail.com" },
    { code : 12 ,nom: "Ali", prenom: "Kamal", specialite: "Physique", email: "ali@gmail.com" },
    { code : 12 ,nom: "Sami", prenom: "Nadia", specialite: "Chimie", email: "sami@gmail.com" },
    { code : 12 ,nom: "Rami", prenom: "Omar", specialite: "Biologie", email: "rami@gmail.com" },
  ]);

  const [nonmodif, setNonmodif] = useState("");
  const [prenonmodif, setPrenonmodif] = useState("");
  const [specialitemodif, setSpecialitemodif] = useState("");
  const [emailmodif, setEmailmodif] = useState("");
  const [indexamodif, setIndexamodif] = useState(-1);
  const [isModalopen, setIsModalopen] = useState(false);
  const [isModaladdopen, setIsModaladdopen] = useState(false);

  const [nonadd, setNonadd] = useState("");
  const [prenomadd, setPrenomadd] = useState("");
  const [specialiteadd, setSpecialiteadd] = useState("");
  const [emailadd, setEmailadd] = useState("");

  const [filterNom, setFilterNom] = useState("");
  const [filterPrenom, setFilterPrenom] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const filteredProfesseurs = TProfesseur.filter(
    (prof) =>
      prof.nom.toLowerCase().includes(filterNom.toLowerCase()) &&
      prof.prenom.toLowerCase().includes(filterPrenom.toLowerCase()) &&
      prof.specialite.toLowerCase().includes(filterSpecialite.toLowerCase()) &&
      prof.email.toLowerCase().includes(filterEmail.toLowerCase())
  );
  const addprof = async ()=>{
    setTProfesseur([...TProfesseur,{nom:nonadd,prenom:prenomadd,specialite:specialiteadd,email:emailadd}])
    let pwd = await getgeneratedpwd()
    emailjs.init('3-yDdMjXAGrpKGg0Q');
    emailjs.send('service_od8zahb', 'template_tq7clmr', {
      to_name: emailadd,           // Email address dynamically inserted
      from_name: 'dd',             // Static 'from_name'
      message: `This is your new password: ${pwd}`, // Dynamic message
      buildyourself: 'dd',         // Static text
      to_email: emailadd           // Email address dynamically inserted
    })
      console.log("hhahahahaha")
    hideModaladd()
    }
    const getgeneratedpwd =  async () =>{
      const url = "http://127.0.0.1:8080/generatepwd"
      let response
      await fetch(url).then((res)=>{ return res.json()}).then(data => {response = data.password
        console.log(response)
      } )
      return response
  }
  

  const modifier = (index) => {
    setNonmodif(TProfesseur[index].nom);
    setPrenonmodif(TProfesseur[index].prenom);
    setSpecialitemodif(TProfesseur[index].specialite);
    setEmailmodif(TProfesseur[index].email);
    setIndexamodif(index);
    showModal();
  };

  const showModal = () => {
    setIsModalopen(true);
  };

  const hideModal = () => {
    setIsModalopen(false);
  };
  const showModaladd = () => {
    setIsModaladdopen(true);
  };

  const hideModaladd = () => {
    setIsModaladdopen(false);
  };

  const handleNonChange = (e) => {
    setNonmodif(e.target.value);
  };

  const handlePrenomChange = (e) => {
    setPrenonmodif(e.target.value);
  };

  const handleSpecialiteChange = (e) => {
    setSpecialitemodif(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmailmodif(e.target.value);
  };
  const handleNonaddChange = (e) => {
    setNonadd(e.target.value); // Update the 'nonadd' state with the input value
  };
  
  const handlePrenomaddChange = (e) => {
    setPrenomadd(e.target.value); // Update the 'prenomadd' state with the input value
  };
  
  const handleSpecialiteaddChange = (e) => {
    setSpecialiteadd(e.target.value); // Update the 'specialiteadd' state with the input value
  };
  
  const handleEmailaddChange = (e) => {
    setEmailadd(e.target.value); // Update the 'emailadd' state with the input value
  };

  // Save changes and update the table
  const sauvegardeChanges = () => {
    setTProfesseur(
      TProfesseur.map((prof, index) => {
        if (index === indexamodif) {
          return {
            nom: nonmodif,
            prenom: prenonmodif,
            specialite: specialitemodif,
            email: emailmodif,
          };
        }
        return prof;
      })
    );
    hideModal();
  };
  const deletprof = (index) =>{
    setTProfesseur(
      TProfesseur.filter((_,idx) => idx !== index)
    );
  }
  // const addprof = ()=>{
  // setTProfesseur([...TProfesseur,{nom:nonadd,prenom:prenomadd,specialite:specialiteadd,email:emailadd}])
  // hideModaladd()
  // }

  const highlightMatch = (text, filter) => {
    if (!filter) return text; // No filter, return original text
    const regex = new RegExp(`(${filter})`, 'gi'); // Match filter text
    return text.replace(regex, '<span class="highlight">$1</span>'); // Wrap match
  };

  return (
    <>
    <button className="btn btn-info" onClick={showModaladd}>
      Add Professeur
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
              placeholder="Filter Prénom"
              value={filterPrenom}
              onChange={(e) => setFilterPrenom(e.target.value)}
            />
          </th>
          <th>
            <input
              type="text"
              className="form-control"
              placeholder="Filter Spécialité"
              value={filterSpecialite}
              onChange={(e) => setFilterSpecialite(e.target.value)}
            />
          </th>
          <th>
            <input
              type="text"
              className="form-control"
              placeholder="Filter Email"
              value={filterEmail}
              onChange={(e) => setFilterEmail(e.target.value)}
            />
          </th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Spécialité</th>
          <th>Email</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {filteredProfesseurs.map((prof, index) => (
          <tr key={index}>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(prof.nom, filterNom) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(prof.prenom, filterPrenom) }}></td>
            <td dangerouslySetInnerHTML={{ __html: highlightMatch(prof.specialite, filterSpecialite) }}></td>
           <td dangerouslySetInnerHTML={{ __html: highlightMatch(prof.email, filterEmail) }}></td>
            <td>
              <button onClick={() => modifier(index)} className="btn btn-info">
                <i className="fa-solid fa-pen"></i>
              </button>
            </td>
            <td>
              <button onClick={() => deletprof(index)} className="btn btn-danger">
                <i className="fa-solid fa-trash"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

      {/* React Modal */}
      <Modal show={isModalopen} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>modification des element de professeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group">
          <label>Nom</label>
          <input
            className="form-control"
            value={nonmodif}
            onChange={handleNonChange}
          />
        </div>
        <div className="form-group">
          <label>Prénom</label>
          <input
            className="form-control"
            value={prenonmodif}
            onChange={handlePrenomChange}
          />
        </div>
        <div className="form-group">
          <label>Spécialité</label>
          <input
            className="form-control"
            value={specialitemodif}
            onChange={handleSpecialiteChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            value={emailmodif}
            onChange={handleEmailChange}
          />
        </div>
        
        </Modal.Body>
        <Modal.Footer>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={hideModal}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={sauvegardeChanges}
          >
            Sauvegarder
          </button>
        </div>
        </Modal.Footer>
      </Modal>
      <Modal show={isModaladdopen} onHide={hideModaladd}>
        <Modal.Header closeButton>
          <Modal.Title>ajouter un professeur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group">
          <label>Nom</label>
          <input
            className="form-control"
            onChange={handleNonaddChange}
          />
        </div>
        <div className="form-group">
          <label>Prénom</label>
          <input
            className="form-control"
            onChange={handlePrenomaddChange}
          />
        </div>
        <div className="form-group">
          <label>Spécialité</label>
          <input
            className="form-control"
            onChange={handleSpecialiteaddChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"

            onChange={handleEmailaddChange}
          />
        </div>
        
        </Modal.Body>
        <Modal.Footer>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={hideModaladd}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={addprof}
          >
            add
          </button>
        </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProfTable;

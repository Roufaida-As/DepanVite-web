import React from "react";

interface Depanneur {
  nom: string;
  prenom: string;
  phone: string;
  adresse: string;
  matricule: string;
  permis: string;
  specialisation: string;
  marque: string;
  modele: string;
  capacite: string;
}

const depanneurs: Depanneur[] = [
  {
    nom: "Benali",
    prenom: "Karim",
    phone: "0550 123 456",
    adresse: "Alger, Hydra",
    matricule: "123-45-67",
    permis: "B1234567",
    specialisation: "Remorquage poids lourds",
    marque: "Mercedes",
    modele: "Actros",
    capacite: "20T",
  },
  {
    nom: "Maamar",
    prenom: "Rachid",
    phone: "0551 987 654",
    adresse: "Oran, Es-Senia",
    matricule: "987-65-43",
    permis: "C7654321",
    specialisation: "Assistance rapide",
    marque: "Renault",
    modele: "Midlum",
    capacite: "10T",
  },
];

export default function DepanneurList() {
  return (
    <div className="p-6">
      {depanneurs.map((d, index) => (
        <div
          key={index}
          className="border border-[#FFC120] rounded-lg p-4 mb-4 shadow-sm"
        >
          <h2 className="text-xl font-bold text-[#FFC120]">
            {d.nom} {d.prenom}
          </h2>
          <p><span className="font-semibold">Téléphone:</span> {d.phone}</p>
          <p><span className="font-semibold">Adresse:</span> {d.adresse}</p>
          <p><span className="font-semibold">Matricule:</span> {d.matricule}</p>
          <p><span className="font-semibold">Permis:</span> {d.permis}</p>
          <p><span className="font-semibold">Spécialisation:</span> {d.specialisation}</p>
          <p><span className="font-semibold">Marque:</span> {d.marque}</p>
          <p><span className="font-semibold">Modèle:</span> {d.modele}</p>
          <p><span className="font-semibold">Capacité:</span> {d.capacite}</p>
        </div>
      ))}
    </div>
  );
}

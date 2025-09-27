import React, { useMemo, useState } from "react";
import Button from "../components/Button";
import SearchBar from "../components/SearchBar";
import SideDrawerForm from "../components/SideDrawerForm";

import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Wrench,
  AlertCircle,
  Car,
  Phone,
  MapPin,
  Badge,
  IdCard,
  Settings,
  Tag,
  Package,
} from "lucide-react";

type Depanneur = {
  id: number;
  nom: string;
  prenom?: string;
  phone?: string;
  adresse?: string;
  matricule?: string;
  permis?: string;
  specialisation?: string;
  marque?: string;
  modele?: string;
  capacite?: string;
  icon: React.ReactNode;
  actif: boolean;
};

export default function DepanneurPage() {
  const initialDepanneurs: Depanneur[] = [
    {
      id: 1,
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
      icon: <Truck className="text-[#FFC120]" size={28} />,
      actif: true,
    },
    {
      id: 2,
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
      icon: <Wrench className="text-[#FFC120]" size={28} />,
      actif: false,
    },
    {
      id: 3,
      nom: "Touati",
      prenom: "Sofiane",
      phone: "0552 456 789",
      adresse: "Constantine, Ali Mendjeli",
      matricule: "456-78-90",
      permis: "D4567890",
      specialisation: "Remorquage urbain",
      marque: "Iveco",
      modele: "Eurocargo",
      capacite: "12T",
      icon: <Car className="text-[#FFC120]" size={28} />,
      actif: true,
    },
    {
      id: 4,
      nom: "Ziani",
      prenom: "Amine",
      phone: "0553 654 321",
      adresse: "Blida, Boufarik",
      matricule: "321-54-76",
      permis: "E7654321",
      specialisation: "Dépannage autoroute",
      marque: "Volvo",
      modele: "FH16",
      capacite: "25T",
      icon: <AlertCircle className="text-[#FFC120]" size={28} />,
      actif: false,
    },
  ];

  const [depanneurs, setDepanneurs] = useState<Depanneur[]>(initialDepanneurs);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // controlled input value in parent (keeps SearchBar in sync)
  const [searchInput, setSearchInput] = useState("");
  // active search term that will be applied when user submits (Enter/click)
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 4;

  const depanneurFields = [
    { name: "nom", label: "Nom" },
    { name: "prenom", label: "Prénom" },
    { name: "phone", label: "Téléphone", type: "tel" },
    { name: "adresse", label: "Adresse" },
    { name: "matricule", label: "Matricule" },
    { name: "permis", label: "Numéro de permis" },
    { name: "specialisation", label: "Spécialisation" },
    { name: "marque", label: "Marque" },
    { name: "modele", label: "Modèle" },
    { name: "capacite", label: "Capacité de remorquage" },
  ];

  const handleAddDepanneur = (data: Record<string, any>) => {
    const newDep: Depanneur = {
      id: Date.now(),
      nom: data.nom ?? "Nouveau",
      prenom: data.prenom ?? "",
      phone: data.phone ?? "",
      adresse: data.adresse ?? "",
      matricule: data.matricule ?? "",
      permis: data.permis ?? "",
      specialisation: data.specialisation ?? "",
      marque: data.marque ?? "",
      modele: data.modele ?? "",
      capacite: data.capacite ?? "",
      icon: <Truck className="text-[#FFC120]" size={28} />,
      actif: true,
    };
    // put new item at top of source list
    setDepanneurs((prev) => [newDep, ...prev]);
    setCurrentPage(1);
  };

  // Called when SearchBar submits (Enter or button)
  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term.trim());
    setCurrentPage(1);
  };

  // Reorder depanneurs so the first match (if any) appears first.
  // This keeps the rest in their original order.
  const reorderedDepanneurs = useMemo(() => {
    if (!searchTerm) return depanneurs;
    const lower = searchTerm.toLowerCase();

    // find first element where nom or prenom contains the query
    const firstIndex = depanneurs.findIndex(
      (d) =>
        d.nom.toLowerCase().includes(lower) ||
        (d.prenom && d.prenom.toLowerCase().includes(lower))
    );

    if (firstIndex === -1) return depanneurs;
    const first = depanneurs[firstIndex];
    const others = depanneurs.filter((d) => d.id !== first.id);
    return [first, ...others];
  }, [depanneurs, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(reorderedDepanneurs.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDepanneurs = reorderedDepanneurs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // toggle by id — safe after reordering
  const toggleActif = (id: number) => {
    setDepanneurs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, actif: !d.actif } : d))
    );
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold-text mb-6">Dépanneurs</h1>

      {/* Search + Buttons */}
      <div className="flex items-center">
        <div className="w-full max-w-md">
          <SearchBar
            text="Dépanneur"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={(term) => handleSearchSubmit(term)}
            placeholder="Rechercher par nom..."
          />
        </div>

        <div className="flex space-x-4 ml-10">
          <Button
            buttonName="Ajouter"
            colors={["text-white", "border-[#FFC120]", "bg-[#FFC120]"]}
            onClick={() => setIsDrawerOpen(true)}
          />
          <Button
            buttonName="Importer"
            colors={["text-[#FFC120]", "border-[#FFC120]", "bg-white"]}
          />
        </div>
      </div>

      {/* Liste des dépanneurs */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentDepanneurs.map((d) => (
          <div
            key={d.id}
            className="border border-[#FFC120] rounded-lg p-4 shadow-sm flex flex-col justify-between"
          >
            {/* Header with icon + name */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {d.icon}
                <h2
                  className="text-xl font-bold text-[#FFC120] cursor-pointer"
                  // optional: clicking a name will re-run the search and promote it to top
                  onClick={() => {
                    setSearchInput(d.nom);
                    handleSearchSubmit(d.nom);
                  }}
                >
                  {d.nom} {d.prenom}
                </h2>
              </div>

              {/* Actif/ Inactif button */}
              <button
                onClick={() => toggleActif(d.id)}
                className={`px-3 py-1 rounded-md text-sm font-semibold border transition ${
                  d.actif
                    ? "bg-white text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                    : "bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                }`}
              >
                {d.actif ? "Actif" : "Inactif"}
              </button>
            </div>

            {/* Info */}
            <div className="text-sm space-y-2">
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-[#FFC120]" /> {d.phone}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-[#FFC120]" /> {d.adresse}
              </p>
              <p className="flex items-center gap-2">
                <Badge size={16} className="text-[#FFC120]" /> {d.matricule}
              </p>
              <p className="flex items-center gap-2">
                <IdCard size={16} className="text-[#FFC120]" /> {d.permis}
              </p>
              <p className="flex items-center gap-2">
                <Settings size={16} className="text-[#FFC120]" />{" "}
                {d.specialisation}
              </p>
              <p className="flex items-center gap-2">
                <Tag size={16} className="text-[#FFC120]" /> {d.marque}
              </p>
              <p className="flex items-center gap-2">
                <Car size={16} className="text-[#FFC120]" /> {d.modele}
              </p>
              <p className="flex items-center gap-2">
                <Package size={16} className="text-[#FFC120]" /> {d.capacite}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="p-2 border rounded disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-[#FFC120] text-white"
                : "bg-white text-black"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="p-2 border rounded disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <SideDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        fields={depanneurFields}
        onSubmit={handleAddDepanneur}
        title="Ajouter un dépanneur"
      />
    </div>
  );
}

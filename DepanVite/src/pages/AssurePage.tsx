import React, { useMemo, useRef, useState } from "react"; // 👈 useRef added
import Button from "../components/Button.js";
import SearchBar from "../components/SearchBar.js";
import SideDrawerForm from "../components/SideDrawerForm.js";

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
  FileWarning,
  FileSpreadsheet,
  CheckCircle,
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

const assureFields = [
  { name: "nom", label: "Nom" },
  { name: "prenom", label: "Prénom" },
  { name: "phone", label: "Téléphone", type: "tel" },
  { name: "adresse", label: "Adresse" },
  { name: "matricule", label: "Matricule" },
  { name: "permis", label: "Numéro de châssis" },
  { name: "specialisation", label: "Marque du véhicule" },
  { name: "marque", label: "Modèle du véhicule" },
  { name: "modele", label: "Type de véhicule" },
];

const initialAssuré: Depanneur[] = [
  {
    id: 1,
    nom: "Benali",
    prenom: "Karim",
    phone: "0550 123 456",
    adresse: "Alger, Hydra",
    matricule: "123-45-67",
    permis: "CH1234567",
    specialisation: "Mercedes",
    marque: "Classe C",
    modele: "Berline",
    icon: <Car className="text-[#FFC120]" size={28} />,
    actif: true,
  },
  {
    id: 2,
    nom: "Maamar",
    prenom: "Rachid",
    phone: "0551 987 654",
    adresse: "Oran, Es-Senia",
    matricule: "987-65-43",
    permis: "CH7654321",
    specialisation: "Renault",
    marque: "Clio 5",
    modele: "Citadine",
    icon: <Car className="text-[#FFC120]" size={28} />,
    actif: false,
  },
  {
    id: 3,
    nom: "Touati",
    prenom: "Sofiane",
    phone: "0552 456 789",
    adresse: "Constantine, Ali Mendjeli",
    matricule: "456-78-90",
    permis: "CH4567890",
    specialisation: "Peugeot",
    marque: "3008",
    modele: "SUV",
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
    permis: "CH7654321",
    specialisation: "Volkswagen",
    marque: "Golf 8",
    modele: "Compacte",
    icon: <Car className="text-[#FFC120]" size={28} />,
    actif: false,
  },
];

export default function AssurePage() {
  const [depanneurs, setDepanneurs] = useState<Depanneur[]>(initialAssuré);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const itemsPerPage = 4;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Popup state
  const [popup, setPopup] = useState<{
    open: boolean;
    type: "excel" | "other";
    title: string;
    message: string;
  }>({ open: false, type: "other", title: "", message: "" });

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "xlsx" || extension === "xls") {
      setPopup({
        open: true,
        type: "excel",
        title: "Import réussi",
        message: `Fichier Excel importé : ${file.name}`,
      });
      // TODO: parse with xlsx if you want to add rows automatically
    } else {
      // Non-excel => show message about required format
      setPopup({
        open: true,
        type: "other",
        title: "Format non supporté",
        message: "Le fichier doit être au format Excel",
      });

      // If you want to preview content of text/csv files instead, uncomment:
      // const reader = new FileReader();
      // reader.onload = (event) => {
      //   setPopup({
      //     open: true,
      //     type: "other",
      //     title: "Aperçu du fichier",
      //     message: String(event.target?.result).slice(0, 2000), // limit length
      //   });
      // };
      // reader.readAsText(file);
    }

    // clear the input value so the same file can be selected again later
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      icon: <Truck className="text-[#FFC120]" size={28} />,
      actif: true,
    };
    setDepanneurs((prev) => [newDep, ...prev]);
    setCurrentPage(1);
  };

  const handleSearchSubmit = (term: string) => {
    setSearchTerm(term.trim());
    setCurrentPage(1);
  };

  const filteredDepanneurs = useMemo(() => {
    if (!searchTerm) return depanneurs;
    const lower = searchTerm.toLowerCase();
    return depanneurs.filter(
      (d) =>
        d.nom.toLowerCase().includes(lower) ||
        (d.prenom && d.prenom.toLowerCase().includes(lower))
    );
  }, [depanneurs, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredDepanneurs.length / itemsPerPage));
  const currentDepanneurs = filteredDepanneurs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleActif = (id: number) => {
    setDepanneurs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, actif: !d.actif } : d))
    );
  };

  return (
    <div className="px-6">
      <h1 className="text-3xl font-bold-text mb-6">Assurés</h1>

      {/* Search + Buttons */}
      <div className="flex items-center">
        <div className="w-full max-w-md">
          <SearchBar
            text="Assuré"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearchSubmit}
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
            onClick={handleImportClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls,.json,.txt"
            className="hidden"
          />
        </div>
      </div>

      {/* Liste des dépanneurs */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentDepanneurs.map((d) => (
          <div
            key={d.id}
            className="border border-[#FFC120] rounded-lg p-4 shadow-md hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {d.icon}
                <h2
                  className="text-xl font-bold text-[#FFC120] cursor-pointer"
                  onClick={() => {
                    setSearchInput(d.nom);
                    handleSearchSubmit(d.nom);
                  }}
                >
                  {d.nom} {d.prenom}
                </h2>
              </div>

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

            <div className="text-sm space-y-2">
              {d.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-[#FFC120]" /> {d.phone}
                </p>
              )}
              {d.adresse && (
                <p className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#FFC120]" /> {d.adresse}
                </p>
              )}
              {d.matricule && (
                <p className="flex items-center gap-2">
                  <Badge size={16} className="text-[#FFC120]" /> {d.matricule}
                </p>
              )}
              {d.permis && (
                <p className="flex items-center gap-2">
                  <IdCard size={16} className="text-[#FFC120]" /> {d.permis}
                </p>
              )}
              {d.specialisation && (
                <p className="flex items-center gap-2">
                  <Settings size={16} className="text-[#FFC120]" /> {d.specialisation}
                </p>
              )}
              {d.marque && (
                <p className="flex items-center gap-2">
                  <Tag size={16} className="text-[#FFC120]" /> {d.marque}
                </p>
              )}
              {d.modele && (
                <p className="flex items-center gap-2">
                  <Car size={16} className="text-[#FFC120]" /> {d.modele}
                </p>
              )}
              {d.capacite && (
                <p className="flex items-center gap-2">
                  <Package size={16} className="text-[#FFC120]" /> {d.capacite}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
              currentPage === i + 1 ? "bg-[#FFC120] text-white" : "bg-white text-black hover:bg-gray-100"
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

      {/* Drawer Form */}
      <SideDrawerForm
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        fields={assureFields}
        onSubmit={handleAddDepanneur}
        title="Ajouter un Assuré"
      />

      {/* === Popup Modal === */}
      {popup.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 animate-fadeIn">
            <div className="flex items-center space-x-3 mb-4">
              {popup.type === "excel" ? (
                <div className="flex items-center space-x-3">
                  <CheckCircle size={36} className="text-green-500 flex-shrink-0" />
                  <h2 className="text-xl font-semibold">{popup.title}</h2>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <FileWarning size={36} className="text-yellow-500 flex-shrink-0" />
                  <h2 className="text-xl font-semibold">{popup.title}</h2>
                </div>
              )}
            </div>

            <pre className="bg-gray-100 rounded-lg p-3 max-h-40 overflow-auto text-sm whitespace-pre-wrap">
              {popup.message}
            </pre>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPopup({ ...popup, open: false })}
                className="px-4 py-2 rounded-lg bg-[#FFC120] text-white hover:bg-yellow-500 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

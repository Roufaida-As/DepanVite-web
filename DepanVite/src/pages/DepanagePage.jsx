import React, { useState, useMemo } from 'react';
import { Search, X, Phone, MapPin, Car, User, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

// Données fictives pour démonstration
const mockDepannages = [
  {
    id: 1,
    immatriculation: "123 AB 16",
    chassis: "VF1BA0K0H47123456",
    marque: "Renault",
    modele: "Clio",
    typeVehicule: "Berline",
    dateDepannage: "2024-09-20",
    heureDepannage: "14:30",
    localisationPanne: "Alger Centre",
    localisationExacte: "Rue Didouche Mourad, devant la poste centrale",
    destination: "Garage Central, Kouba",
    kilometrage: 15,
    depanneurNom: "Ahmed",
    depanneurPrenom: "Benali",
    depanneurMatricule: "76516",
    depanneurTel: "0555123456",
    commentaire: "Panne d'embrayage, véhicule remorqué avec précaution"
  },
  {
    id: 2,
    immatriculation: "456 CD 31",
    chassis: "VF7SA9HZ8FW654321",
    marque: "Peugeot",
    modele: "208",
    typeVehicule: "Citadine",
    dateDepannage: "2024-09-19",
    heureDepannage: "09:15",
    localisationPanne: "Constantine",
    localisationExacte: "Autoroute A1, sortie Constantine Est",
    destination: "Garage Moderne, Constantine",
    kilometrage: 8,
    depanneurNom: "Karim",
    depanneurPrenom: "Meziane",
    depanneurMatricule: "76516",
    depanneurTel: "0661987654",
    commentaire: "Crevaison + changement de roue sur autoroute"
  },
  {
    id: 3,
    immatriculation: "789 EF 09",
    chassis: "WDB9636131L123789",
    marque: "Mercedes",
    modele: "Sprinter",
    typeVehicule: "Utilitaire",
    dateDepannage: "2024-09-18",
    heureDepannage: "16:45",
    localisationPanne: "Blida",
    localisationExacte: "Zone industrielle de Boufarik",
    destination: "Atelier Mercedes, Alger",
    kilometrage: 45,
    depanneurNom: "Omar",
    depanneurPrenom: "Khelifi",
    depanneurMatricule: "76516",
    depanneurTel: "0770456789",
    commentaire: "Problème moteur, diagnostic nécessaire"
  },
  {
    id: 4,
    immatriculation: "234 GH 07",
    chassis: "WDB9636131L123790",
    marque: "Volkswagen",
    modele: "Golf",
    typeVehicule: "Berline",
    dateDepannage: "2024-09-17",
    heureDepannage: "11:20",
    localisationPanne: "Oran",
    localisationExacte: "Boulevard de la Révolution",
    destination: "Garage Volkswagen, Oran",
    kilometrage: 12,
    depanneurNom: "Yacine",
    depanneurPrenom: "Messaoud",
    depanneurMatricule: "76517",
    depanneurTel: "0550789123",
    commentaire: "Problème de batterie"
  },
  {
    id: 5,
    immatriculation: "567 IJ 21",
    chassis: "WDB9636131L123791",
    marque: "Ford",
    modele: "Focus",
    typeVehicule: "Break",
    dateDepannage: "2024-09-16",
    heureDepannage: "08:30",
    localisationPanne: "Tizi Ouzou",
    localisationExacte: "Route nationale 12",
    destination: "Garage Ford, Tizi Ouzou",
    kilometrage: 28,
    depanneurNom: "Smail",
    depanneurPrenom: "Benaissa",
    depanneurMatricule: "76518",
    depanneurTel: "0661456789",
    commentaire: "Surchauffe moteur"
  },
  {
    id: 6,
    immatriculation: "890 KL 35",
    chassis: "WDB9636131L123792",
    marque: "Hyundai",
    modele: "i30",
    typeVehicule: "Berline",
    dateDepannage: "2024-09-15",
    heureDepannage: "15:45",
    localisationPanne: "Sétif",
    localisationExacte: "Centre-ville, Place de l'Indépendance",
    destination: "Garage Hyundai, Sétif",
    kilometrage: 18,
    depanneurNom: "Farid",
    depanneurPrenom: "Boumediene",
    depanneurMatricule: "76519",
    depanneurTel: "0770123456",
    commentaire: "Panne électrique"
  }
];

const ITEMS_PER_PAGE = 3;

const DepannagePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [selectedDepannage, setSelectedDepannage] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = [
    { value: 'tous', label: 'Tous les champs' },
    { value: 'immatriculation', label: "Numéro d'immatriculation" },
    { value: 'chassis', label: 'Numéro de châssis' },
    { value: 'marque', label: 'Marque' },
    { value: 'modele', label: 'Modèle' },
    { value: 'date', label: 'Date exacte' },
    { value: 'intervalle', label: 'Intervalle de dates' },
    { value: 'depanneur', label: 'Nom prénom dépanneur' },
    { value: 'matricule_depanneur', label: 'Matricule dépanneur' },
    { value: 'localisation', label: 'Localisation de panne' },
    { value: 'destination', label: 'Destination' }
  ];

  const filteredDepannages = useMemo(() => {
    let filtered = mockDepannages;

    if (searchTerm || selectedFilter === 'intervalle') {
      filtered = mockDepannages.filter(depannage => {
        const searchLower = searchTerm.toLowerCase();

        // Filtre par intervalle de dates
        if (selectedFilter === 'intervalle' && dateDebut && dateFin) {
          const depannageDate = new Date(depannage.dateDepannage);
          const debut = new Date(dateDebut);
          const fin = new Date(dateFin);
          const isInInterval = depannageDate >= debut && depannageDate <= fin;
          
          if (!searchTerm) return isInInterval;
          
          // Si on a aussi un terme de recherche avec intervalle
          const matchesSearch = depannage.immatriculation.toLowerCase().includes(searchLower) ||
            depannage.chassis.toLowerCase().includes(searchLower) ||
            depannage.marque.toLowerCase().includes(searchLower) ||
            depannage.modele.toLowerCase().includes(searchLower) ||
            `${depannage.depanneurPrenom} ${depannage.depanneurNom}`.toLowerCase().includes(searchLower) ||
            depannage.depanneurMatricule.toLowerCase().includes(searchLower) ||
            depannage.localisationPanne.toLowerCase().includes(searchLower) ||
            depannage.destination.toLowerCase().includes(searchLower);
          
          return isInInterval && matchesSearch;
        }

        switch (selectedFilter) {
          case 'immatriculation':
            return depannage.immatriculation.toLowerCase().includes(searchLower);
          case 'chassis':
            return depannage.chassis.toLowerCase().includes(searchLower);
          case 'marque':
            return depannage.marque.toLowerCase().includes(searchLower);
          case 'modele':
            return depannage.modele.toLowerCase().includes(searchLower);
          case 'date':
            return depannage.dateDepannage === searchTerm;
          case 'depanneur':
            return `${depannage.depanneurPrenom} ${depannage.depanneurNom}`.toLowerCase().includes(searchLower);
          case 'matricule_depanneur':
            return depannage.depanneurMatricule.toLowerCase().includes(searchLower);
          case 'localisation':
            return depannage.localisationPanne.toLowerCase().includes(searchLower);
          case 'destination':
            return depannage.destination.toLowerCase().includes(searchLower);
          default:
            return depannage.immatriculation.toLowerCase().includes(searchLower) ||
                   depannage.chassis.toLowerCase().includes(searchLower) ||
                   depannage.marque.toLowerCase().includes(searchLower) ||
                   depannage.modele.toLowerCase().includes(searchLower) ||
                   `${depannage.depanneurPrenom} ${depannage.depanneurNom}`.toLowerCase().includes(searchLower) ||
                   depannage.depanneurMatricule.toLowerCase().includes(searchLower) ||
                   depannage.localisationPanne.toLowerCase().includes(searchLower) ||
                   depannage.destination.toLowerCase().includes(searchLower);
        }
      });
    }

    // Reset page when filter changes
    if (currentPage > Math.ceil(filtered.length / ITEMS_PER_PAGE)) {
      setCurrentPage(1);
    }

    return filtered;
  }, [searchTerm, selectedFilter, dateDebut, dateFin, currentPage]);

  // Pagination logic
  const totalPages = Math.ceil(filteredDepannages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDepannages = filteredDepannages.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCall = (numero) => {
    window.open(`tel:${numero}`, '_self');
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 3;
    
    // Bouton précédent
    buttons.push(
      <button
        key="prev"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: '#FFC120',
          backgroundColor: 'white',
          color: '#11141A'
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );

    // Pages
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className="w-10 h-10 border rounded-lg transition-colors font-medium"
          style={{
            borderColor: '#FFC120',
            backgroundColor: currentPage === i ? '#FFC120' : 'white',
            color: currentPage === i ? 'white' : '#11141A',
            fontFamily: 'Poppins, sans-serif'
          }}
        >
          {i}
        </button>
      );
    }

    // Bouton suivant
    buttons.push(
      <button
        key="next"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: '#FFC120',
          backgroundColor: 'white',
          color: '#11141A'
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-white w-full" style={{fontFamily: 'Poppins, sans-serif'}}>
      <div className="w-full px-4 md:px-6">
        {/* Header avec filtres */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
            Liste des Dépannages
          </h1>
          
          {/* Zone de filtrage */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 w-full" style={{border: '1px solid #ffc120'}}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Sélecteur de filtre personnalisé */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                  Type de filtre
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 text-left flex justify-between items-center"
                    style={{
                      borderColor: '#FFC120', 
                      fontFamily: 'Poppins, sans-serif',
                      backgroundColor: 'white'
                    }}
                  >
                    <span>{filterOptions.find(option => option.value === selectedFilter)?.label}</span>
                    <svg className={`w-5 h-5 transform transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isSelectOpen && (
                    <div 
                      className="absolute top-full left-0 right-0 z-50 bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto"
                      style={{borderColor: '#FFC120'}}
                    >
                      {filterOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setSelectedFilter(option.value);
                            setIsSelectOpen(false);
                            setCurrentPage(1); // Reset to first page when filter changes
                          }}
                          className="w-full text-left px-3 py-2 hover:text-white transition-colors"
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            backgroundColor: selectedFilter === option.value ? '#FFC120' : 'white',
                            color: selectedFilter === option.value ? 'white' : '#11141A'
                          }}
                          onMouseOver={(e) => {
                            if (selectedFilter !== option.value) {
                              e.target.style.backgroundColor = '#ffcd50';
                              e.target.style.color = 'white';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (selectedFilter !== option.value) {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.color = '#11141A';
                            }
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Champ de recherche - caché si intervalle */}
              {selectedFilter !== 'intervalle' && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    {selectedFilter === 'date' ? 'Date (YYYY-MM-DD)' : 'Rechercher'}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={selectedFilter === 'date' ? 'date' : 'text'}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page when search changes
                      }}
                      placeholder={
                        selectedFilter === 'date' ? '' :
                        selectedFilter === 'tous' ? 'Rechercher dans tous les champs...' :
                        `Rechercher par ${filterOptions.find(f => f.value === selectedFilter)?.label.toLowerCase()}...`
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: '#FFC120', 
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Champs de dates pour intervalle */}
              {selectedFilter === 'intervalle' && (
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                      Date début
                    </label>
                    <input
                      type="date"
                      value={dateDebut}
                      onChange={(e) => {
                        setDateDebut(e.target.value);
                        setCurrentPage(1); // Reset to first page when date changes
                      }}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: '#FFC120', 
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                      Date fin
                    </label>
                    <input
                      type="date"
                      value={dateFin}
                      onChange={(e) => {
                        setDateFin(e.target.value);
                        setCurrentPage(1); // Reset to first page when date changes
                      }}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                      style={{
                        borderColor: '#FFC120', 
                        fontFamily: 'Poppins, sans-serif'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600" style={{fontFamily: 'Poppins, sans-serif'}}>
              {filteredDepannages.length} résultat(s) trouvé(s)
            </div>
          </div>
        </div>

        {/* Liste des dépannages */}
        <div className="space-y-4">
          {currentDepannages.map(depannage => (
            <div
              key={depannage.id}
              onClick={() => setSelectedDepannage(depannage)}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4 w-full"
              style={{
                borderLeftColor: '#FFC120', 
                fontFamily: 'Poppins, sans-serif', 
                border: '1px solid #ffc120'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="font-bold text-lg mb-1" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    {depannage.immatriculation}
                  </div>
                  <div className="text-gray-600" style={{fontFamily: 'Poppins, sans-serif'}}>
                    {depannage.marque} {depannage.modele}
                  </div>
                </div>
                <div>
                  <div className="font-medium" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    {formatDate(depannage.dateDepannage)}
                  </div>
                  <div className="text-gray-600 flex items-center mt-1" style={{fontFamily: 'Poppins, sans-serif'}}>
                    <MapPin className="h-4 w-4 mr-1" />
                    {depannage.localisationPanne}
                  </div>
                </div>
                <div>
                  <div className="font-medium" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    {depannage.depanneurPrenom} {depannage.depanneurNom}
                  </div>
                  <div className="text-gray-600 flex items-center mt-1" style={{fontFamily: 'Poppins, sans-serif'}}>
                    <Phone className="h-4 w-4 mr-1" />
                    {depannage.depanneurTel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredDepannages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg" style={{fontFamily: 'Poppins, sans-serif'}}>
              Aucun dépannage trouvé avec les critères de recherche actuels
            </div>
          </div>
        )}

        {/* Pagination - At the end of the list */}
        {filteredDepannages.length > 0 && totalPages > 1 && (
          <div className="flex justify-end mt-8 mb-8">
            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2" style={{border: '1px solid #FFC120'}}>
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>

      {/* Pop-up des détails */}
      {selectedDepannage && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
             style={{backgroundColor: 'rgba(255, 255, 255, 0.3)', fontFamily: 'Poppins, sans-serif'}}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
               style={{fontFamily: 'Poppins, sans-serif'}}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center" 
                 style={{backgroundColor: '#ffcb48', fontFamily: 'Poppins, sans-serif'}}>
              <h2 className="text-2xl font-bold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                Détails du Dépannage
              </h2>
              <button
                onClick={() => setSelectedDepannage(null)}
                className="p-2 hover:bg-[#FFC120] rounded-full"
              >
                <X className="h-6 w-6" style={{color: '#11141A'}} />
              </button>
            </div>

            <div className="p-6 space-y-6" style={{fontFamily: 'Poppins, sans-serif'}}>
              {/* Section Véhicule */}
              <div>
                <div className="flex items-center mb-4">
                  <Car className="h-6 w-6 mr-2" style={{color: '#FFC120'}} />
                  <h3 className="text-xl font-bold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    Véhicule
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Immatriculation:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.immatriculation}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Numéro de châssis:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.chassis}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Marque:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.marque}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Modèle:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.modele}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Type de véhicule:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.typeVehicule}</p>
                  </div>
                </div>
              </div>

              {/* Section Dépannage */}
              <div>
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 mr-2" style={{color: '#FFC120'}} />
                  <h3 className="text-xl font-bold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    Dépannage
                  </h3>
                </div>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Localisation exacte:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.localisationExacte}</p>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Destination:</span>
                    <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.destination}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Kilométrage:</span>
                      <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.kilometrage} km</p>
                    </div>
                    <div>
                      <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Date et heure:</span>
                      <div className="flex items-center text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(selectedDepannage.dateDepannage)}
                        <Clock className="h-4 w-4 ml-3 mr-1" />
                        {selectedDepannage.heureDepannage}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Dépanneur */}
              <div>
                <div className="flex items-center mb-4">
                  <User className="h-6 w-6 mr-2" style={{color: '#FFC120'}} />
                  <h3 className="text-xl font-bold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>
                    Dépanneur
                  </h3>
                </div>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Nom et prénom:</span>
                      <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.depanneurPrenom} {selectedDepannage.depanneurNom}</p>
                    </div>
                    <div>
                      <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Matricule:</span>
                      <p className="text-gray-700" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.depanneurMatricule || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Téléphone:</span>
                    <button
                      onClick={() => handleCall(selectedDepannage.depanneurTel)}
                      className="flex items-center text-blue-600 hover:text-blue-800 ml-2"
                      style={{fontFamily: 'Poppins, sans-serif'}}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      {selectedDepannage.depanneurTel}
                    </button>
                  </div>
                  <div>
                    <span className="font-semibold" style={{color: '#11141A', fontFamily: 'Poppins, sans-serif'}}>Commentaire:</span>
                    <p className="text-gray-700 mt-2" style={{fontFamily: 'Poppins, sans-serif'}}>{selectedDepannage.commentaire}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepannagePage;
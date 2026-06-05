import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialUsers = [
  { id: 1, name: 'Admin', lastName: 'Sistema', username: 'admin', phone: '1122334455', password: 'admin123', role: 'admin', status: 'ACTIVO', registrationDate: '2026-01-01' },
  { id: 2, name: 'Emanuel', lastName: 'Pérez', username: 'emanuel', phone: '1144556677', password: '123', role: 'usuario', status: 'ACTIVO', registrationDate: '2026-05-10' },
  { id: 3, name: 'Nico', lastName: 'Gómez', username: 'nico', phone: '1155667788', password: '123', role: 'usuario', status: 'ACTIVO', registrationDate: '2026-05-11' },
  { id: 4, name: 'Lucas', lastName: 'Martínez', username: 'lucas', phone: '1166778899', password: '123', role: 'usuario', status: 'ACTIVO', registrationDate: '2026-05-12' },
  { id: 5, name: 'Mati', lastName: 'López', username: 'mati', phone: '1177889900', password: '123', role: 'usuario', status: 'ACTIVO', registrationDate: '2026-05-13' },
  { id: 6, name: 'Juan', lastName: 'Rodríguez', username: 'juan', phone: '1188990011', password: '123', role: 'usuario', status: 'ACTIVO', registrationDate: '2026-06-01' },
  { id: 7, name: 'Fede', lastName: 'García', username: 'fede', phone: '1199001122', password: '123', role: 'usuario', status: 'BLOQUEADO', registrationDate: '2026-05-05' },
];

const initialEconomics = {
  entryFee: 30000,
  totalMatchdays: 7,
  matchesPerMatchday: 10
};

const initialMatchdays = [
  { id: 1, number: 1, status: 'ABIERTA' },
  { id: 2, number: 2, status: 'ABIERTA' },
  { id: 3, number: 3, status: 'ABIERTA' },
];

const initialMatches = [
  // --- FECHA 1: Jornada 1 de Fase de Grupos ---
  // Grupo A
  { id: 1, matchdayId: 1, local: 'Mexico', visitante: 'Sudafrica', date: '2026-06-11', time: '13:00', stadium: 'Estadio Azteca', group: 'Grupo A', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 2, matchdayId: 1, local: 'Corea del Sur', visitante: 'Chequia', date: '2026-06-11', time: '16:00', stadium: 'Estadio Akron', group: 'Grupo A', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo B
  { id: 3, matchdayId: 1, local: 'Canada', visitante: 'Italia', date: '2026-06-12', time: '12:00', stadium: 'BMO Field', group: 'Grupo B', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 4, matchdayId: 1, local: 'Qatar', visitante: 'Suiza', date: '2026-06-12', time: '15:00', stadium: 'BC Place', group: 'Grupo B', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo C
  { id: 5, matchdayId: 1, local: 'Brasil', visitante: 'Marruecos', date: '2026-06-13', time: '13:00', stadium: 'Gillette Stadium', group: 'Grupo C', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 6, matchdayId: 1, local: 'Haiti', visitante: 'Escocia', date: '2026-06-13', time: '16:00', stadium: 'Levis Stadium', group: 'Grupo C', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo D
  { id: 7, matchdayId: 1, local: 'Estados Unidos', visitante: 'Paraguay', date: '2026-06-12', time: '18:00', stadium: 'SoFi Stadium', group: 'Grupo D', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 8, matchdayId: 1, local: 'Australia', visitante: 'Turquia', date: '2026-06-13', time: '19:00', stadium: 'Lumen Field', group: 'Grupo D', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo E
  { id: 9, matchdayId: 1, local: 'Alemania', visitante: 'Curazao', date: '2026-06-14', time: '12:00', stadium: 'Lincoln Financial Field', group: 'Grupo E', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 10, matchdayId: 1, local: 'Costa de Marfil', visitante: 'Ecuador', date: '2026-06-14', time: '15:00', stadium: 'NRG Stadium', group: 'Grupo E', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo F
  { id: 11, matchdayId: 1, local: 'Paises Bajos', visitante: 'Japon', date: '2026-06-14', time: '18:00', stadium: 'AT&T Stadium', group: 'Grupo F', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 12, matchdayId: 1, local: 'Polonia', visitante: 'Tunez', date: '2026-06-14', time: '21:00', stadium: 'Estadio BBVA', group: 'Grupo F', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo G
  { id: 13, matchdayId: 1, local: 'Belgica', visitante: 'Egipto', date: '2026-06-15', time: '13:00', stadium: 'Mercedes-Benz Stadium', group: 'Grupo G', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 14, matchdayId: 1, local: 'Iran', visitante: 'Nueva Zelanda', date: '2026-06-15', time: '16:00', stadium: 'Hard Rock Stadium', group: 'Grupo G', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo H
  { id: 15, matchdayId: 1, local: 'Espana', visitante: 'Cabo Verde', date: '2026-06-15', time: '19:00', stadium: 'MetLife Stadium', group: 'Grupo H', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 16, matchdayId: 1, local: 'Arabia Saudita', visitante: 'Uruguay', date: '2026-06-15', time: '22:00', stadium: 'Arrowhead Stadium', group: 'Grupo H', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo I
  { id: 17, matchdayId: 1, local: 'Francia', visitante: 'Senegal', date: '2026-06-16', time: '13:00', stadium: 'Lincoln Financial Field', group: 'Grupo I', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 18, matchdayId: 1, local: 'Bolivia', visitante: 'Noruega', date: '2026-06-16', time: '16:00', stadium: 'NRG Stadium', group: 'Grupo I', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo J
  { id: 19, matchdayId: 1, local: 'Argentina', visitante: 'Argelia', date: '2026-06-16', time: '19:00', stadium: 'Hard Rock Stadium', group: 'Grupo J', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 20, matchdayId: 1, local: 'Austria', visitante: 'Jordania', date: '2026-06-16', time: '22:00', stadium: 'Mercedes-Benz Stadium', group: 'Grupo J', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo K
  { id: 21, matchdayId: 1, local: 'Portugal', visitante: 'Jamaica', date: '2026-06-17', time: '13:00', stadium: 'Gillette Stadium', group: 'Grupo K', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 22, matchdayId: 1, local: 'Uzbekistan', visitante: 'Colombia', date: '2026-06-17', time: '16:00', stadium: 'Levis Stadium', group: 'Grupo K', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  // Grupo L
  { id: 23, matchdayId: 1, local: 'Inglaterra', visitante: 'Croacia', date: '2026-06-17', time: '19:00', stadium: 'MetLife Stadium', group: 'Grupo L', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
  { id: 24, matchdayId: 1, local: 'Ghana', visitante: 'Panama', date: '2026-06-17', time: '22:00', stadium: 'Arrowhead Stadium', group: 'Grupo L', status: 'PROXIMO', scoreLocal: null, scoreVisitante: null },
];

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [economics, setEconomics] = useState(initialEconomics);
  const [matchdays, setMatchdays] = useState([]);
  const [matches, setMatches] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Initialize mock data in local storage if not exists
    const localUsers = localStorage.getItem('prode_users');
    if (!localUsers) {
      localStorage.setItem('prode_users', JSON.stringify(initialUsers));
      setUsers(initialUsers);
    } else {
      setUsers(JSON.parse(localUsers));
    }

    const localEconomics = localStorage.getItem('prode_economics');
    if (!localEconomics) {
      localStorage.setItem('prode_economics', JSON.stringify(initialEconomics));
    } else {
      setEconomics(JSON.parse(localEconomics));
    }

    const localMatchdays = localStorage.getItem('prode_matchdays');
    if (!localMatchdays) {
      localStorage.setItem('prode_matchdays', JSON.stringify(initialMatchdays));
      setMatchdays(initialMatchdays);
    } else {
      setMatchdays(JSON.parse(localMatchdays));
    }

    const localMatches = localStorage.getItem('prode_matches');
    if (!localMatches) {
      localStorage.setItem('prode_matches', JSON.stringify(initialMatches));
      setMatches(initialMatches);
    } else {
      setMatches(JSON.parse(localMatches));
    }

    const localAudit = localStorage.getItem('prode_audit');
    if (!localAudit) {
      localStorage.setItem('prode_audit', JSON.stringify([]));
      setAuditLogs([]);
    } else {
      setAuditLogs(JSON.parse(localAudit));
    }

    const localPredictions = localStorage.getItem('prode_predictions');
    if (!localPredictions) {
      localStorage.setItem('prode_predictions', JSON.stringify([]));
      setPredictions([]);
    } else {
      setPredictions(JSON.parse(localPredictions));
    }
  }, []);

  const addLog = (action, details) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'admin' // In a real app, this is the current user
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    localStorage.setItem('prode_audit', JSON.stringify(updated));
  };

  const registerUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      role: 'usuario',
      status: 'PENDIENTE',
      registrationDate: new Date().toISOString().split('T')[0]
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('prode_users', JSON.stringify(updatedUsers));
  };

  const updateUserStatus = (userId, newStatus) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
    setUsers(updatedUsers);
    localStorage.setItem('prode_users', JSON.stringify(updatedUsers));
  };

  const addMatchday = (matchday) => {
    const updated = [...matchdays, { ...matchday, id: Date.now() }];
    setMatchdays(updated);
    localStorage.setItem('prode_matchdays', JSON.stringify(updated));
  };

  const updateMatchday = (id, data) => {
    const updated = matchdays.map(m => m.id === id ? { ...m, ...data } : m);
    setMatchdays(updated);
    localStorage.setItem('prode_matchdays', JSON.stringify(updated));
  };

  const deleteMatchday = (id) => {
    const updated = matchdays.filter(m => m.id !== id);
    setMatchdays(updated);
    localStorage.setItem('prode_matchdays', JSON.stringify(updated));
  };

  const addMatch = (match) => {
    const updated = [...matches, { ...match, id: Date.now() }];
    setMatches(updated);
    localStorage.setItem('prode_matches', JSON.stringify(updated));
  };

  const updateMatch = (id, data) => {
    const updated = matches.map(m => m.id === id ? { ...m, ...data } : m);
    setMatches(updated);
    localStorage.setItem('prode_matches', JSON.stringify(updated));
  };

  const deleteMatch = (id) => {
    const updated = matches.filter(m => m.id !== id);
    setMatches(updated);
    localStorage.setItem('prode_matches', JSON.stringify(updated));
  };

  const savePredictions = (userId, matchdayId, newPredictions) => {
    // Remove existing predictions for this user and this matchday
    const otherPredictions = predictions.filter(
      p => !(p.userId === userId && p.matchdayId === matchdayId)
    );
    const updated = [...otherPredictions, ...newPredictions];
    setPredictions(updated);
    localStorage.setItem('prode_predictions', JSON.stringify(updated));
  };

  const value = {
    users,
    registerUser,
    updateUserStatus,
    economics,
    setEconomics,
    matchdays,
    addMatchday,
    updateMatchday,
    deleteMatchday,
    matches,
    addMatch,
    updateMatch,
    deleteMatch,
    auditLogs,
    addLog,
    predictions,
    savePredictions
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [economics, setEconomics] = useState({ entryFee: 0, totalMatchdays: 0 });
  const [matchdays, setMatchdays] = useState([]);
  const [matches, setMatches] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchAllData = async () => {
    try {
      const [
        { data: usersData },
        { data: ecoData },
        { data: mdaysData },
        { data: matchesData },
        { data: predsData },
        { data: logsData }
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('economics').select('*'),
        supabase.from('matchdays').select('*').order('id', { ascending: true }),
        supabase.from('matches').select('*').order('id', { ascending: true }),
        supabase.from('predictions').select('*'),
        supabase.from('audit_logs').select('*').order('log_date', { ascending: false })
      ]);

      if (usersData) {
        setUsers(usersData.map(u => ({
          id: u.id, username: u.username, password: u.password, name: u.name,
          lastName: u.last_name, dni: u.dni, phone: u.phone, email: u.email,
          status: u.status, role: u.role, approvedBy: u.approved_by, registrationDate: u.registration_date
        })));
      }
      
      if (ecoData && ecoData[0]) {
        setEconomics({ entryFee: ecoData[0].entry_fee, totalMatchdays: ecoData[0].total_matchdays });
      }

      if (mdaysData) setMatchdays(mdaysData);

      if (matchesData) {
        setMatches(matchesData.map(m => ({
          id: m.id, matchdayId: m.matchday_id, local: m.local_team, visitante: m.visitante_team,
          date: m.match_date, time: m.match_time, stadium: m.stadium, group: m.group_name,
          status: m.status, scoreLocal: m.score_local, scoreVisitante: m.score_visitante
        })));
      }

      if (predsData) {
        setPredictions(predsData.map(p => ({
          id: p.id, userId: p.user_id, matchdayId: p.matchday_id, matchId: p.match_id,
          predictedLocal: p.predicted_local, predictedVisitante: p.predicted_visitante
        })));
      }

      if (logsData) {
        setAuditLogs(logsData.map(l => ({
          id: l.id, date: l.log_date, action: l.action, detail: l.detail
        })));
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const addLog = async (action, detail) => {
    const newLog = {
      id: Date.now().toString(),
      action,
      detail
    };
    await supabase.from('audit_logs').insert([newLog]);
    setAuditLogs(prev => [{ ...newLog, date: new Date().toISOString() }, ...prev]);
  };

  const registerUser = async (userData) => {
    const newUser = {
      username: userData.username,
      password: userData.password,
      name: userData.name,
      last_name: userData.lastName,
      dni: userData.dni || '',
      phone: userData.phone,
      email: userData.email || `${userData.username}@prodemundial.com`,
      status: 'PENDIENTE',
      role: 'user'
    };
    const { data, error } = await supabase.from('users').insert([newUser]).select();
    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === '23505') {
         return { error: 'Ese nombre de usuario ya está registrado' };
      }
      return { error: 'Error de conexión. Inténtalo de nuevo.' };
    }
    if (data && data.length > 0) {
      const u = data[0];
      setUsers(prev => [...prev, {
        id: u.id, username: u.username, password: u.password, name: u.name,
        lastName: u.last_name, dni: u.dni, phone: u.phone, email: u.email,
        status: u.status, role: u.role, approvedBy: u.approved_by, registrationDate: u.registration_date
      }]);
      return { success: true };
    }
    return { error: 'Error desconocido' };
  };

  const updateUserStatus = async (userId, newStatus) => {
    await supabase.from('users').update({ status: newStatus }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const addMatchday = async (matchday) => {
    const newId = Date.now();
    await supabase.from('matchdays').insert([{ id: newId, number: matchday.number, status: matchday.status, name: matchday.name }]);
    setMatchdays(prev => [...prev, { ...matchday, id: newId }]);
  };

  const updateMatchday = async (id, data) => {
    await supabase.from('matchdays').update({ status: data.status, name: data.name }).eq('id', id);
    setMatchdays(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMatchday = async (id) => {
    await supabase.from('matchdays').delete().eq('id', id);
    setMatchdays(prev => prev.filter(m => m.id !== id));
  };

  const addMatch = async (match) => {
    const newId = Date.now();
    const insertData = {
      id: newId,
      matchday_id: match.matchdayId,
      local_team: match.local,
      visitante_team: match.visitante,
      match_date: match.date,
      match_time: match.time,
      stadium: match.stadium,
      group_name: match.group,
      status: match.status,
      score_local: match.scoreLocal,
      score_visitante: match.scoreVisitante
    };
    await supabase.from('matches').insert([insertData]);
    setMatches(prev => [...prev, { ...match, id: newId }]);
  };

  const updateMatch = async (id, data) => {
    const updatePayload = {};
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.scoreLocal !== undefined) updatePayload.score_local = data.scoreLocal;
    if (data.scoreVisitante !== undefined) updatePayload.score_visitante = data.scoreVisitante;

    await supabase.from('matches').update(updatePayload).eq('id', id);
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMatch = async (id) => {
    await supabase.from('matches').delete().eq('id', id);
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const savePredictions = async (userId, matchdayId, newPredictions) => {
    await supabase.from('predictions')
      .delete()
      .eq('user_id', userId)
      .eq('matchday_id', matchdayId);

    const inserts = newPredictions.map(p => ({
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      user_id: p.userId,
      matchday_id: p.matchdayId,
      match_id: p.matchId,
      predicted_local: p.predictedLocal,
      predicted_visitante: p.predictedVisitante
    }));

    if (inserts.length > 0) {
      await supabase.from('predictions').insert(inserts);
    }
    
    setPredictions(prev => {
      const otherPredictions = prev.filter(p => !(p.userId === userId && p.matchdayId === matchdayId));
      const newPredsMapped = inserts.map(ins => ({
        id: ins.id, userId: ins.user_id, matchdayId: ins.matchday_id, matchId: ins.match_id,
        predictedLocal: ins.predicted_local, predictedVisitante: ins.predicted_visitante
      }));
      return [...otherPredictions, ...newPredsMapped];
    });
  };

  const calculateUserPoints = (userId, matchdayId = null) => {
    let points = 0;
    const userPreds = predictions.filter(p => p.userId === userId && (matchdayId === null || p.matchdayId === matchdayId));
    
    userPreds.forEach(pred => {
      const match = matches.find(m => m.id === pred.matchId);
      if (match && match.scoreLocal !== null && match.scoreVisitante !== null) {
        const realResult = Math.sign(match.scoreLocal - match.scoreVisitante);
        const predResult = Math.sign(pred.predictedLocal - pred.predictedVisitante);
        
        if (pred.predictedLocal === match.scoreLocal && pred.predictedVisitante === match.scoreVisitante) {
          points += 3;
        } else if (realResult === predResult) {
          points += 1;
        }
      }
    });
    return points;
  };

  const value = {
    users,
    registerUser,
    updateUserStatus,
    economics,
    setEconomics: async (eco) => {
       await supabase.from('economics').update({ entry_fee: eco.entryFee, total_matchdays: eco.totalMatchdays }).eq('id', 1);
       setEconomics(eco);
    },
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
    savePredictions,
    calculateUserPoints,
  };

  if (loadingData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--color-bg)', color: '#fff' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Conectando a base de datos segura...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

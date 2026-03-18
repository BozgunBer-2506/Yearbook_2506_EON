import { useState, useEffect } from 'react';
import { HolographicYearbook } from '../components/HolographicYearbook';

const API = '/api';

interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_picture_url?: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  profile_picture_url?: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tRes, sRes] = await Promise.all([
        fetch(`${API}/yearbook/teachers`),
        fetch(`${API}/yearbook/students`)
      ]);
      const tData = await tRes.json();
      const sData = await sRes.json();
      setTeachers(tData);
      setStudents(sData);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  if (loading) return <div className="loading">LÄDT...</div>;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">EON JAHRBUCH 25-06</div>
        <button className="logout-btn" onClick={handleLogout}>LOGOUT</button>
      </header>

      <main className="main" style={{ justifyContent: 'center', padding: '20px' }}>
        <HolographicYearbook 
          teachers={teachers} 
          students={students} 
          currentUser={user} 
        />
      </main>
    </div>
  );
}

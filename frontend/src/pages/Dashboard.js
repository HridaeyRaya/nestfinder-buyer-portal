import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';


//  CONSTANTS

const PROPERTY_TYPES = [
  { type: 'Apartment', emoji: '🏢' },
  { type: 'House', emoji: '🏡' },
  { type: 'Villa', emoji: '🏘' },
  { type: 'Land', emoji: '🌳' },
  { type: 'Commercial', emoji: '🏬' },
];

const TYPE_BG = {
  Apartment: '#E1F5EE',
  House: '#EAF3DE',
  Villa: '#FAEEDA',
  Land: '#d1fae5',
  Commercial: '#F1EFE8',
};


//  SAFE LOCAL STORAGE HELPERS

const getUserFromStorage = () => {
  try {
    const data = localStorage.getItem('user');

    // prevent crash cases
    if (!data || data === 'undefined' || data === 'null') {
      return null;
    }

    return JSON.parse(data);
  } catch (err) {
    console.warn('Invalid user in localStorage. Clearing...');
    localStorage.removeItem('user');
    return null;
  }
};

const clearAuthStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};


//  COMPONENT

function Dashboard() {
  const [favourites, setFavourites] = useState([]);
  const [newProperty, setNewProperty] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedType, setSelectedType] = useState('Apartment');
  const [success, setSuccess] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  //  SAFE USER LOAD
  const user = getUserFromStorage();


  //  TOAST HANDLER

  const showToast = (setter, msg) => {
    setter(msg);
    setTimeout(() => setter(''), 3000);
  };

  //  FETCH FAVOURITES

  const fetchFavourites = useCallback(async () => {
    try {
      const res = await API.get('favourites/');
      setFavourites(Array.isArray(res.data) ? res.data : []);
    } catch {
      showToast(setError, 'Failed to load favourites.');
    }
  }, []);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);


  // ADD PROPERTY
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!newProperty.trim()) {
      showToast(setError, 'Property name is required.');
      return;
    }

    const emoji =
      PROPERTY_TYPES.find((t) => t.type === selectedType)?.emoji || '🏠';

    const itemName = `${newProperty.trim()}||${selectedType}||${emoji}`;

    try {
      await API.post('favourites/add/', {
        item_name: itemName,
        image_url: imageUrl.trim() || null,
      });

      showToast(setSuccess, `"${newProperty}" saved to favourites!`);

      setNewProperty('');
      setImageUrl('');
      fetchFavourites();
    } catch (err) {
      showToast(
        setError,
        err?.response?.data?.error || 'Failed to add property.'
      );
    }
  };


  //  REMOVE PROPERTY

  const handleRemove = async (id, name) => {
    try {
      await API.delete(`favourites/delete/${id}/`);
      showToast(setDeleteMsg, `"${name}" removed.`);
      fetchFavourites();
    } catch {
      showToast(setError, 'Failed to remove.');
    }
  };


  //  PARSE ITEM NAME

  const parseFav = (itemName) => {
    if (!itemName) {
      return { name: 'Unknown', type: 'Property', emoji: '🏠' };
    }

    const parts = itemName.split('||');

    if (parts.length === 3) {
      return { name: parts[0], type: parts[1], emoji: parts[2] };
    }

    return { name: itemName, type: 'Property', emoji: '🏠' };
  };


  //  RENDER

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f7f5' }}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.htitle}>NestFinder</div>
          <div style={s.hsub}>
            Welcome, {user?.name || 'User'}
          </div>
          <span style={s.badge}>Buyer</span>
        </div>

        <button
          style={s.logoutBtn}
          onClick={() => {
            clearAuthStorage();
            navigate('/login');
          }}
        >
          Logout
        </button>
      </div>

      <div style={s.body}>
        {/* Toasts */}
        {success && <div style={{ ...s.toast, ...s.toastGreen }}>{success}</div>}
        {deleteMsg && <div style={{ ...s.toast, ...s.toastRed }}>{deleteMsg}</div>}
        {error && <div style={{ ...s.toast, ...s.toastRed }}>{error}</div>}

        {/* Add Property */}
        <div style={s.card}>
          <div style={s.clabel}>Add a property</div>

          <form onSubmit={handleAdd}>
            <input
              style={s.input}
              placeholder="Property name (e.g. 2BHK Apartment, Lazimpat)"
              value={newProperty}
              onChange={(e) => setNewProperty(e.target.value)}
            />

            <div style={s.sublabel}>Property type</div>

            <div style={s.typeRow}>
              {PROPERTY_TYPES.map(({ type, emoji }) => (
                <button
                  key={type}
                  type="button"
                  style={
                    selectedType === type
                      ? { ...s.typeBtn, ...s.typeBtnActive }
                      : s.typeBtn
                  }
                  onClick={() => setSelectedType(type)}
                >
                  {emoji} {type}
                </button>
              ))}
            </div>

            <input
              style={s.input}
              placeholder="Image URL (optional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <button style={s.addBtn} type="submit">
              + Save to favourites
            </button>
          </form>
        </div>

        {/* Favourites */}
        <div style={s.card}>
          <div style={s.clabel}>
            My favourites ({favourites.length})
          </div>

          {favourites.length === 0 ? (
            <p style={s.empty}>No saved properties yet.</p>
          ) : (
            <div style={s.grid}>
              {favourites.map((fav) => {
                const { name, type, emoji } = parseFav(fav.item_name);

                return (
                  <div key={fav.id} style={s.propCard}>
                    {fav.image_url && (
                      <img
                        src={fav.image_url}
                        alt={name}
                        style={s.propImg}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}

                    {!fav.image_url && (
                      <div
                        style={{
                          ...s.propEmoji,
                          background: TYPE_BG[type] || '#EAF3DE',
                        }}
                      >
                        <span style={{ fontSize: '38px' }}>{emoji}</span>
                      </div>
                    )}

                    <div style={s.propBody}>
                      <div>
                        <div style={s.propName}>{name}</div>
                        <div style={s.propType}>{type}</div>
                      </div>

                      <button
                        style={s.removeBtn}
                        onClick={() => handleRemove(fav.id, name)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Style
const s = {
  header: {
    background: '#1D9E75',
    padding: '18px 28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  htitle: { fontSize: '18px', fontWeight: '500', color: 'white' },
  hsub: { fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '3px' },
  badge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.18)',
    color: 'white',
    fontSize: '11px',
    padding: '2px 10px',
    borderRadius: '20px',
    marginTop: '4px',
  },
  logoutBtn: {
    background: 'white',
    color: '#1D9E75',
    border: 'none',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  body: { maxWidth: '700px', margin: '24px auto', padding: '0 18px' },
  card: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
  },
  clabel: { fontSize: '14px', fontWeight: '500', marginBottom: '14px' },
  sublabel: { fontSize: '12px', color: '#6b7280', marginBottom: '8px' },
  input: {
    width: '100%',
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '10px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  typeRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' },
  typeBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #d1d5db',
    background: 'white',
    color: '#6b7280',
    fontSize: '12px',
    cursor: 'pointer',
  },
  typeBtnActive: {
    background: '#EAF3DE',
    color: '#3B6D11',
    border: '1px solid #97C459',
  },
  addBtn: {
    width: '100%',
    padding: '10px',
    background: '#1D9E75',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  toast: { padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px' },
  toastGreen: { background: '#EAF3DE', color: '#3B6D11' },
  toastRed: { background: '#FCEBEB', color: '#A32D2D' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '14px' },
  propCard: { border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' },
  propImg: { width: '100%', height: '130px', objectFit: 'cover', display: 'block' },
  propEmoji: { width: '100%', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  propBody: {
    padding: '12px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propName: { fontSize: '13px', fontWeight: '500', marginBottom: '2px' },
  propType: { fontSize: '11px', color: '#1D9E75' },
  removeBtn: {
    padding: '5px 12px',
    background: '#FCEBEB',
    color: '#A32D2D',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    padding: '30px 0',
  },
};

export default Dashboard;
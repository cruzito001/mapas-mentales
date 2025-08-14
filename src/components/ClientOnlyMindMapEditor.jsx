import React, { useState, useEffect } from 'react';
import MindMapEditor from './MindMapEditor';

const ClientOnlyMindMapEditor = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-primary, #ffffff)',
        color: 'var(--text-primary, #000000)'
      }}>
        <div>Cargando editor...</div>
      </div>
    );
  }

  return <MindMapEditor />;
};

export default ClientOnlyMindMapEditor;
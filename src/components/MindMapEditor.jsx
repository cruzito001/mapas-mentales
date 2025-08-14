import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useThemeSafe } from '../hooks/useThemeSafe';
import EditorToolbar from './EditorToolbar';
import styles from './MindMapEditor.module.css';
// SVG Icons as inline components
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const CursorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
    <path d="m13 13 6 6"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12,5 19,12 12,19"></polyline>
  </svg>
);

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const RotateCcwIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
  </svg>
);

const Trash2Icon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const MindMapEditor = () => {
  const { isDarkMode } = useThemeSafe();

  // Helper function to get contrasting text color
  const getContrastColor = (backgroundColor) => {
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };
  const [nodes, setNodes] = useState([
    {
      id: 'root',
      x: 400,
      y: 300,
      width: 200,
      height: 60,
      text: 'Idea Principal',
      color: '#00A651',
      textColor: '#FFFFFF',
      fontSize: 16,
      isRoot: true
    }
  ]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [dragState, setDragState] = useState({ isDragging: false, dragOffset: { x: 0, y: 0 } });
  const [resizeState, setResizeState] = useState({ isResizing: false, handle: null, startSize: null, startPos: null });
  const [connectionState, setConnectionState] = useState({
    isConnecting: false,
    fromNode: null
  });

  const [connectionStyles, setConnectionStyles] = useState({
    strokeWidth: 2,
    color: '#666',
    type: 'solid' // solid, dashed, dotted
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState('select'); // select, node, connection
  
  const canvasRef = useRef(null);
  const editorRef = useRef(null);

  // Auto-save functionality
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      const mindMapData = {
        nodes,
        connections,
        zoom,
        pan,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('currentMindMap', JSON.stringify(mindMapData));
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [nodes, connections, zoom, pan]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('currentMindMap');
    if (savedData) {
      try {
        const { nodes: savedNodes, connections: savedConnections, zoom: savedZoom, pan: savedPan } = JSON.parse(savedData);
        if (savedNodes && savedNodes.length > 0) {
          setNodes(savedNodes);
          setConnections(savedConnections || []);
          setZoom(savedZoom || 1);
          setPan(savedPan || { x: 0, y: 0 });
        }
      } catch (error) {
        console.error('Error loading saved mind map:', error);
      }
    }
  }, []);

  const createNode = useCallback((x, y, text = 'Nueva Idea') => {
    const newNode = {
      id: `node-${Date.now()}`,
      x: x - 75, // Center the node
      y: y - 30,
      width: 150,
      height: 60,
      text,
      color: '#007AFF',
      textColor: '#FFFFFF',
      fontSize: 14,
      isRoot: false
    };
    setNodes(prev => [...prev, newNode]);
    return newNode;
  }, []);

  const updateNode = useCallback((nodeId, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);



  const createConnection = useCallback((fromId, toId) => {
    // Avoid duplicate connections
    const exists = connections.some(conn => 
      (conn.from === fromId && conn.to === toId) || 
      (conn.from === toId && conn.to === fromId)
    );
    
    if (!exists && fromId !== toId) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: fromId,
        to: toId,
        color: connectionStyles.color,
        width: connectionStyles.strokeWidth,
        style: connectionStyles.type,
        animated: false
      };
      setConnections(prev => [...prev, newConnection]);
    }
  }, [connections, connectionStyles]);



  const updateConnection = useCallback((connectionId, updates) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId ? { ...conn, ...updates } : conn
    ));
  }, []);

  const handleConnectionClick = useCallback((connection, e) => {
    e.stopPropagation();
    if (tool === 'select') {
      setSelectedConnection(connection);
      setSelectedNode(null);
    }
  }, [tool]);

  const startEditingNode = useCallback((nodeId) => {
    setEditingNode(nodeId);
    setSelectedNode(null);
    setSelectedConnection(null);
  }, []);

  const finishEditingNode = useCallback((nodeId, newText) => {
    if (newText.trim()) {
      setNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, text: newText.trim() } : node
      ));
    }
    setEditingNode(null);
  }, []);

  const handleNodeDoubleClick = useCallback((nodeId, e) => {
    e.stopPropagation();
    if (tool === 'select') {
      startEditingNode(nodeId);
    }
  }, [tool, startEditingNode]);

  const handleResizeStart = useCallback((handle, node, e) => {
    e.stopPropagation();
    setResizeState({
      isResizing: true,
      handle,
      startSize: { width: node.width, height: node.height },
      startPos: { x: e.clientX, y: e.clientY }
    });
  }, []);

  const handleResizeMove = useCallback((e) => {
    if (!resizeState.isResizing || !selectedNode) return;

    const deltaX = e.clientX - resizeState.startPos.x;
    const deltaY = e.clientY - resizeState.startPos.y;
    
    let newWidth = resizeState.startSize.width;
    let newHeight = resizeState.startSize.height;
    let newX = selectedNode.x;
    let newY = selectedNode.y;

    switch (resizeState.handle) {
      case 'topLeft':
        newWidth = Math.max(80, resizeState.startSize.width - deltaX);
        newHeight = Math.max(40, resizeState.startSize.height - deltaY);
        newX = selectedNode.x + (resizeState.startSize.width - newWidth);
        newY = selectedNode.y + (resizeState.startSize.height - newHeight);
        break;
      case 'topRight':
        newWidth = Math.max(80, resizeState.startSize.width + deltaX);
        newHeight = Math.max(40, resizeState.startSize.height - deltaY);
        newY = selectedNode.y + (resizeState.startSize.height - newHeight);
        break;
      case 'bottomLeft':
        newWidth = Math.max(80, resizeState.startSize.width - deltaX);
        newHeight = Math.max(40, resizeState.startSize.height + deltaY);
        newX = selectedNode.x + (resizeState.startSize.width - newWidth);
        break;
      case 'bottomRight':
        newWidth = Math.max(80, resizeState.startSize.width + deltaX);
        newHeight = Math.max(40, resizeState.startSize.height + deltaY);
        break;
    }

    setNodes(prev => prev.map(node => 
      node.id === selectedNode.id 
        ? { ...node, width: newWidth, height: newHeight, x: newX, y: newY }
        : node
    ));
  }, [resizeState, selectedNode]);

  const handleResizeEnd = useCallback(() => {
    setResizeState({ isResizing: false, handle: null, startSize: null, startPos: null });
  }, []);

  const handleCanvasClick = useCallback((event) => {
    if (tool === 'node') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - pan.x) / zoom;
      const y = (event.clientY - rect.top - pan.y) / zoom;
      createNode(x, y);
    } else {
      setSelectedNode(null);
      setSelectedConnection(null);
      setIsEditing(false);
      // Cancel connection if in progress
      if (connectionState.isConnecting) {
        setConnectionState({ isConnecting: false, fromNode: null });
      }
    }
  }, [tool, pan, zoom, createNode, connectionState]);

  const handleNodeClick = useCallback((node, event) => {
    event.stopPropagation();
    
    if (tool === 'connection') {
      if (!connectionState.isConnecting) {
        // Start connection
        setConnectionState({ isConnecting: true, fromNode: node.id });
      } else if (connectionState.fromNode !== node.id) {
        // Complete connection
        createConnection(connectionState.fromNode, node.id);
        setConnectionState({ isConnecting: false, fromNode: null });
      }
    } else {
      setSelectedNode(node);
      setSelectedConnection(null);
      if (event.detail === 2) { // Double click
        setIsEditing(true);
      }
    }
  }, [tool, connectionState, createConnection]);



  const handleZoom = useCallback((delta, centerX, centerY) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
    
    // Zoom towards the center point
    const zoomFactor = newZoom / zoom;
    const newPan = {
      x: centerX - (centerX - pan.x) * zoomFactor,
      y: centerY - (centerY - pan.y) * zoomFactor
    };
    
    setZoom(newZoom);
    setPan(newPan);
  }, [zoom, pan]);

  const deleteNode = useCallback((nodeId) => {
    if (nodeId === 'root') return; // Don't delete root node
    
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  const deleteConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setSelectedConnection(null);
  }, []);



  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleNodeUpdate = useCallback((nodeId, updates) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  }, []);

  const handleNodeDelete = useCallback((nodeId) => {
    if (nodeId === 'root') return;
    
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setConnections(prev => prev.filter(conn => 
      conn.from !== nodeId && conn.to !== nodeId
    ));
    
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [selectedNode]);

  // Mouse event handlers
  const handleCanvasMouseDown = useCallback((event) => {
    if (tool === 'node') {
      handleCanvasClick(event);
    }
  }, [tool, handleCanvasClick]);

  const handleCanvasMouseMove = useCallback((event) => {
    // Update connection preview position
    if (connectionState.isConnecting && connectionState.fromNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left - pan.x) / zoom;
      const mouseY = (event.clientY - rect.top - pan.y) / zoom;
      
      setConnectionState(prev => ({
        ...prev,
        previewPosition: { x: mouseX, y: mouseY }
      }));
    }
  }, [connectionState.isConnecting, connectionState.fromNode, pan, zoom]);

  const handleCanvasMouseUp = useCallback((event) => {
    // Handle mouse up for ending drag
    setDragState({ isDragging: false, dragOffset: { x: 0, y: 0 } });
  }, []);

  const handleNodeMouseDown = useCallback((event, node) => {
    event.stopPropagation();
    setSelectedNode(node);
    setDragState({ isDragging: true, dragOffset: { x: 0, y: 0 }, nodeId: node.id });
  }, []);

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = event.clientX - rect.left;
    const centerY = event.clientY - rect.top;
    handleZoom(delta, centerX, centerY);
  }, [handleZoom]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragState.isDragging && selectedNode) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - dragState.dragOffset.x) / zoom - pan.x;
        const y = (e.clientY - rect.top - dragState.dragOffset.y) / zoom - pan.y;
        
        setNodes(prev => prev.map(node => 
          node.id === selectedNode.id ? { ...node, x, y } : node
        ));
      } else if (resizeState.isResizing) {
        handleResizeMove(e);
      }
    };

    const handleMouseUp = () => {
      setDragState({ isDragging: false, dragOffset: { x: 0, y: 0 } });
      handleResizeEnd();
    };

    if (dragState.isDragging || resizeState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, selectedNode, zoom, pan, handleResizeMove, handleResizeEnd]);

  return (
    <div className={styles.editorContainer}>
      <EditorToolbar 
        tool={tool}
        onToolChange={setTool}
        zoom={zoom}
        onZoom={handleZoom}
        onResetView={resetView}
        selectedNode={selectedNode}
        onNodeUpdate={handleNodeUpdate}
        onNodeDelete={handleNodeDelete}
        connectionStyles={connectionStyles}
        onConnectionStylesChange={setConnectionStyles}
        selectedConnection={selectedConnection}
        onConnectionDelete={deleteConnection}
      />
      <div 
        ref={canvasRef}
        className={`${styles.canvas} ${styles[tool + 'Tool']} ${dragState.isDragging ? styles.dragging : ''}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: '0 0',
          marginTop: '60px' // Account for toolbar height
        }}
      >
        {/* SVG for connections */}
        <svg 
          className={styles.connection}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto'
          }}
        >
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" 
             refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={isDarkMode ? '#666' : '#999'} />
            </marker>
          </defs>
          {connections.map(connection => {
            const fromNode = nodes.find(n => n.id === connection.from);
            const toNode = nodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return null;
            
            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height / 2;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y + toNode.height / 2;
            
            const isSelected = selectedConnection?.id === connection.id;
            const strokeDasharray = connection.style === 'dashed' ? '5,5' : 
                                   connection.style === 'dotted' ? '2,2' : 'none';
            
            return (
              <g key={connection.id}>
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  className={`${styles.connectionLine} ${isSelected ? styles.selectedConnection : ''} ${
                    connection.style === 'dashed' ? styles.dashedLine :
                    connection.style === 'dotted' ? styles.dottedLine : ''
                  }`}
                  stroke={isSelected ? '#FF6B35' : (connection.color || connectionStyles.color || '#666')}
                  strokeWidth={isSelected ? (connection.width || 2) + 1 : (connection.strokeWidth || connectionStyles.strokeWidth || 3)}
                  strokeDasharray={strokeDasharray}
                  markerEnd="url(#arrowhead)"
                  onClick={(e) => handleConnectionClick(connection, e)}
                  style={{
                    cursor: tool === 'select' ? 'pointer' : 'default',
                    animation: connection.animated ? 'connectionPulse 2s infinite' : 'none'
                  }}
                />
                {/* Connection control point for editing */}
                {isSelected && (
                  <circle
                    cx={(fromX + toX) / 2}
                    cy={(fromY + toY) / 2}
                    r="4"
                    fill="#FF6B35"
                    stroke="white"
                    strokeWidth="2"
                    className={styles.connectionHandle}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConnection(connection.id);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </g>
            );
          })}
          
          {/* Preview connection while connecting */}
          {connectionState.isConnecting && connectionState.fromNode && connectionState.previewPosition && (
            <line
              x1={nodes.find(n => n.id === connectionState.fromNode)?.x + (nodes.find(n => n.id === connectionState.fromNode)?.width || 0) / 2}
              y1={nodes.find(n => n.id === connectionState.fromNode)?.y + (nodes.find(n => n.id === connectionState.fromNode)?.height || 0) / 2}
              x2={connectionState.previewPosition.x}
              y2={connectionState.previewPosition.y}
              stroke="#FF6B35"
              strokeWidth="2"
              strokeDasharray="5,5"
              className={styles.previewConnection}
              markerEnd="url(#arrowhead)"
            />
          )}
        </svg>
        
        {/* Render nodes */}
        {nodes.map(node => {
          const isSelected = selectedNode?.id === node.id;
          const isBeingDragged = dragState.isDragging && selectedNode?.id === node.id;
          const isEditing = editingNode === node.id;
          const isConnectionSource = connectionState.isConnecting && connectionState.fromNode === node.id;
          
          return (
            <div
              key={node.id}
              className={`${styles.node} ${isSelected ? styles.selectedNode : ''} ${isBeingDragged ? styles.draggingNode : ''} ${isEditing ? styles.editingNode : ''} ${isConnectionSource ? styles.connectionSource : ''}`}
              style={{
                left: node.x,
                top: node.y,
                width: node.width,
                height: node.height,
                backgroundColor: node.color,
                transform: isBeingDragged ? 'scale(1.05)' : 'scale(1)',
                zIndex: isBeingDragged ? 1000 : isSelected || isEditing ? 100 : 10
              }}
              onMouseDown={(e) => !isEditing && handleNodeMouseDown(e, node)}
              onClick={(e) => !isEditing && handleNodeClick(node, e)}
              onDoubleClick={(e) => handleNodeDoubleClick(node.id, e)}
            >
              {isEditing ? (
                <input
                  type="text"
                  className={styles.nodeInput}
                  defaultValue={node.text}
                  autoFocus
                  style={{ fontSize: node.fontSize ? `${node.fontSize}px` : '14px' }}
                  onBlur={(e) => finishEditingNode(node.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      finishEditingNode(node.id, e.target.value);
                    } else if (e.key === 'Escape') {
                      setEditingNode(null);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span 
                  className={styles.nodeText}
                  style={{ fontSize: node.fontSize ? `${node.fontSize}px` : '14px' }}
                >
                  {node.text}
                </span>
              )}
              
              {/* Resize handles */}
               {isSelected && !isBeingDragged && !isEditing && (
                 <>
                   <div 
                     className={`${styles.resizeHandle} ${styles.topLeft}`}
                     onMouseDown={(e) => handleResizeStart('topLeft', node, e)}
                   />
                   <div 
                     className={`${styles.resizeHandle} ${styles.topRight}`}
                     onMouseDown={(e) => handleResizeStart('topRight', node, e)}
                   />
                   <div 
                     className={`${styles.resizeHandle} ${styles.bottomLeft}`}
                     onMouseDown={(e) => handleResizeStart('bottomLeft', node, e)}
                   />
                   <div 
                     className={`${styles.resizeHandle} ${styles.bottomRight}`}
                     onMouseDown={(e) => handleResizeStart('bottomRight', node, e)}
                   />
                 </>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MindMapEditor;
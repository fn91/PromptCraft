import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';

import PromptBlock from './PromptBlock';
import { promptTemplates } from '../data/templates'; 
import '../App.css';

const PromptEditor = () => {
  const [blocks, setBlocks] = useState(() => {
    const savedBlocks = localStorage.getItem('promptcraft_data');
    return savedBlocks ? JSON.parse(savedBlocks) : [
      { id: crypto.randomUUID(), type: "role", content: "Actúa como un Senior Developer", isActive: true }
    ];
  });

  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem('promptcraft_data', JSON.stringify(blocks));
  }, [blocks]);

  const executePrompt = async () => {
    if (blocks.length === 0) return;
    setIsLoading(true);
    setAiResponse("");

    // Simulación de delay de IA
    setTimeout(() => {
      setAiResponse(`🤖 ANÁLISIS DE IA COMPLETADO\n\nHe procesado tu estructura de ${blocks.filter(b => b.isActive).length} bloques.\n\nTu configuración actual es óptima para generar código limpio y mantenible. Los parámetros de "Contexto" y "Instrucción" están bien definidos.`);
      setIsLoading(false);
    }, 2500);
  };

  const applyTemplate = (templateBlocks) => {
    const sanitized = templateBlocks.map(b => ({ ...b, id: crypto.randomUUID(), isActive: true }));
    setBlocks(prev => [...prev, ...sanitized]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const finalPrompt = blocks.filter(b => b.isActive).map(b => b.content).join("\n\n");

  return (
    <div className="container">
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ textAlign: 'left' }}>PromptCraft <span style={{ color: '#8b5cf6' }}>Lab</span></h1>
        <p style={{ color: '#94a3b8', margin: 0 }}>Ingeniería de prompts modular y profesional</p>
      </header>

      {/* Barra de Plantillas Estilo Chips */}
      <div className="template-bar" style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '30px', 
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        {promptTemplates.map(tpl => (
          <button key={tpl.id} onClick={() => applyTemplate(tpl.blocks)} className="btn-template" style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#a78bfa',
            padding: '8px 16px',
            borderRadius: '100px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.3s'
          }}>
            {tpl.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button className="btn-add" onClick={() => setBlocks([...blocks, { id: crypto.randomUUID(), type: "context", content: "", isActive: true }])} style={{ flex: 1 }}>
          + Añadir Bloque
        </button>
        <button 
          onClick={() => { if(window.confirm("¿Vaciar mesa de trabajo?")) setBlocks([]); }}
          style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '12px', padding: '0 20px', cursor: 'pointer' }}
        >
          Limpiar
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="blocks-list">
            {blocks.map((block) => (
              <PromptBlock 
                key={block.id} 
                block={block} 
                handleEdit={(id, val) => setBlocks(blocks.map(b => b.id === id ? {...b, content: val} : b))}
                handleTypeChange={(id, type) => setBlocks(blocks.map(b => b.id === id ? {...b, type} : b))}
                toggleActive={(id) => setBlocks(blocks.map(b => b.id === id ? {...b, isActive: !b.isActive} : b))}
                deleteBlock={(id) => setBlocks(blocks.filter(b => b.id !== id))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <button 
          className={`btn-add ${isLoading ? 'loading-pulse' : ''}`} 
          onClick={executePrompt}
          disabled={isLoading || blocks.length === 0}
          style={{ 
            width: '100%',
            fontSize: '1.2rem',
            padding: '20px',
            background: isLoading ? '#4c1d95' : 'linear-gradient(135deg, #99aca1, #0e2b8a)'
          }}
        >
          {isLoading ? "⚡ PROCESANDO DATOS..." : "🚀 EJECUTAR PROMPT"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: aiResponse ? '1fr 1fr' : '1fr', gap: '20px' }}>
        {/* Resultado del Texto */}
        <section className="output-section" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span className="output-header">Consola de Salida</span>
            <button onClick={() => navigator.clipboard.writeText(finalPrompt)} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer' }}>Copiar</button>
          </div>
          <pre style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{finalPrompt || "// Esperando bloques..."}</pre>
        </section>

        {/* Respuesta de la IA con Skeletons */}
        {isLoading ? (
          <section className="output-section response-area">
            <span className="output-header" style={{ color: '#bb0b1a' }}>IA Pensando...</span>
            <div className="skeleton-line" style={{ width: '90%', marginTop: '15px' }}></div>
            <div className="skeleton-line" style={{ width: '70%' }}></div>
            <div className="skeleton-line" style={{ width: '85%' }}></div>
          </section>
        ) : aiResponse && (
          <section className="output-section response-area animate-fade-in">
            <span className="output-header" style={{ color: '#0bbe14' }}>Resultado Inteligencia Artificial</span>
            <div style={{ marginTop: '15px', color: '#f8fafc', lineHeight: '1.6' }}>{aiResponse}</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
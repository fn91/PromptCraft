// src/components/PromptBlock.jsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const PromptBlock = ({ block, handleEdit, handleTypeChange, toggleActive, deleteBlock }) => {
  // 1. CONFIGURACIÓN DEL HOOK DE ARRASTRE
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  // 2. ESTILOS DINÁMICOS (Mezclamos D&D con tus estilos de UI)
  const accentColor = 
    block.type === 'role' ? '#3b82f6' : 
    block.type === 'variable' ? '#eab308' : '#10b981';

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
    borderLeft: `6px solid ${accentColor}`,
    backgroundColor: block.isActive ? '#fff' : '#f3f4f6',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: isDragging ? '0 8px 20px rgba(0,0,0,0.15)' : '0 2px 5px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    position: 'relative',
  };

  return (
    // setNodeRef permite que dnd-kit identifique este elemento HTML
    <div ref={setNodeRef} style={style} className="block-card">
      <div className="block-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        
        {/* MANEJADOR DE ARRASTRE (⠿) */}
        <div 
          {...attributes} 
          {...listeners} 
          style={{ cursor: 'grab', fontSize: '1.2rem', color: '#94a3b8', padding: '0 5px' }}
          title="Arrastrar para reordenar"
        >
          ⠿
        </div>

        <select 
          value={block.type} 
          onChange={(e) => handleTypeChange(block.id, e.target.value)}
        >
          <option value="role">Rol/Persona</option>
          <option value="context">Contexto</option>
          <option value="variable">Variable</option>
          <option value="instruction">Instrucción</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* AQUÍ usamos toggleActive */}
          <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input 
              type="checkbox" 
              checked={block.isActive} 
              onChange={() => toggleActive(block.id)} 
            /> Activo
          </label>
          
          {/* AQUÍ usamos deleteBlock */}
          <button 
            onClick={() => deleteBlock(block.id)}
            style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
          >
            🗑️
          </button>
        </div>
      </div>

      <textarea
        style={{ 
          width: '100%', 
          padding: '10px', 
          boxSizing: 'border-box', 
          borderRadius: '4px', 
          border: '1px solid #e2e8f0',
          outline: 'none'
        }}
        rows="3"
        value={block.content}
        onChange={(e) => handleEdit(block.id, e.target.value)}
        // TRUCO SENIOR: Evitamos que el arrastre interfiera con la escritura
        onPointerDown={(e) => e.stopPropagation()} 
        placeholder={`Escribe aquí el contenido...`}
      />
    </div>
  );
};

export default PromptBlock;
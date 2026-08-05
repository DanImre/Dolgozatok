import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  hideHeader?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  hideHeader = false,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.setAttribute('data-mousedown-target', 'true');
        } else {
          e.currentTarget.removeAttribute('data-mousedown-target');
        }
      }}
      onMouseUp={(e) => {
        if (e.target === e.currentTarget && e.currentTarget.getAttribute('data-mousedown-target') === 'true') {
          onClose();
        }
        e.currentTarget.removeAttribute('data-mousedown-target');
      }}
    >
      <div 
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
            {typeof title === 'string' ? (
              <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            ) : (
              title
            )}
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            >
              ✕
            </button>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

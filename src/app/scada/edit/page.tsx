'use client';
import React from 'react';

export default function EditHmiScreen(): React.ReactElement {
  // Podrías mostrar un listado de pantallas existentes,
  // con posibilidad de abrir un editor detallado para cada una.

  const handleSelectScreen = (screenId: string) => {
    // Podrías navegar a /scada/edit/[id] o algo similar
    // donde esté un editor avanzado.
    alert(`Seleccionaste la pantalla con ID: ${screenId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Editar Pantallas</h2>
      <p>Aquí se listarán las pantallas existentes...</p>
      {/* ejemplo de listado */}
      <ul>
        <li onClick={() => handleSelectScreen('screen-1')}>Pantalla #1</li>
        <li onClick={() => handleSelectScreen('screen-2')}>Pantalla #2</li>
      </ul>
    </div>
  );
}

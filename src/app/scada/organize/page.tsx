'use client';
import React from 'react';

export default function OrganizeScreens(): React.ReactElement {
  // Aquí podrías representar la secuencia
  // (ejemplo: una lista ordenable, o un diagrama en React Flow,
  //  indicando “pantalla A => pantalla B => pantalla C”).

  const handleSaveFlow = () => {
    // Lógica para guardar la secuencia en la BD o en un estado global
    alert('Flujo de pantallas guardado');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Organizar Flujo de Pantallas</h2>
      <p>Aquí podrías mostrar, por ejemplo, un listado de pantallas que se pueden arrastrar para cambiar de orden, o un mini-diagrama de flujo.</p>
      <button
        onClick={handleSaveFlow}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Guardar Flujo
      </button>
    </div>
  );
}

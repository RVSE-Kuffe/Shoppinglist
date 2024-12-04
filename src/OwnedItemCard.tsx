import React, { useState } from "react"; 
import "./owneditemcard.less"; 
import { ListItemDTO, shopListService } from "./ClientService";

/**
 * Egy meglévő, birtokolt tételt megjelenítő kártya.
 * @param item A megjelenítendő listaelem adatai.
 * @param onDecrease A darabszám csökkentésének eseménykezelője.
 */
export function OwnedItemCard({
  item,
  onDecrease,
}: {
  item: ListItemDTO;
  onDecrease: () => void;
}) {
  return (
    <div className="owned-item-card">
      {/* Az elem neve */}
      <h4 className="item-name">{item.name}</h4>

      {/* Darabszám és csökkentő gomb */}
      <div className="item-count-container">
        {/* Az elem darabszáma */}
        <span className="item-count">Darabszám: {item.count}</span>

        {/* Csökkentés gomb */}
        <button
          className="decrement-button"
          onClick={onDecrease} // Gomb kattintás eseménykezelője
          disabled={item.count <= 0} // Tiltás, ha a darabszám 0 vagy kevesebb
        >
          -
        </button>
      </div>
    </div>
  );
}

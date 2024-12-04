import React from 'react'; 
import './listitemcard.less'; 
import { ListItemDTO } from './ClientService'; 

/**
 * Egy listaelem megjelenítésére szolgáló kártya komponens.
 * @param item A megjelenítendő listaelem adatai.
 * @param onDelete A törlés gomb eseménykezelője.
 * @param onTick A pipa gomb eseménykezelője (elem megvásárlásként jelölése).
 * @param onIncrease A darabszám növelésének eseménykezelője.
 * @param onDecrease A darabszám csökkentésének eseménykezelője.
 */
export function ListItemCard({ item, onDelete, onTick, onIncrease, onDecrease }:
  {
    item: ListItemDTO,
    onDelete: () => void,
    onTick: () => void,
    onIncrease: () => void,
    onDecrease: () => void
  }) 
{
  return (
    <div className={`list-item-card ${item.isBought ? 'bought' : ''}`}>
      {/* Listaelem információs blokk */}
      <div className="item-info">
        {/* Listaelem neve */}
        <h4 className="item-name">{item.name}</h4>

        {/* Darabszám és vezérlőgombok */}
        <div className="item-count-container">
          <span className="item-count">Darabszám: {item.count}</span>
          <div className="count-buttons">
            {/* Darabszám csökkentése */}
            <button
              className="decrease-button"
              onClick={onDecrease}
              disabled={item.count <= 0} // Tiltás, ha a darabszám nem csökkenthető tovább
            >
              -
            </button>
            {/* Darabszám növelése */}
            <button
              className="increase-button"
              onClick={onIncrease}
            >
              +
            </button>
          </div>
        </div>

        {/* Fontosság megjelenítése */}
        <span className={`item-importance ${item.importance.toLowerCase()}`}>
          Fontosság: {item.importance}
        </span>
      </div>

      {/* Műveleti gombok (törlés és pipa) */}
      <div className="button-group">
        {/* Elem törlése */}
        <button 
          className="delete-button" 
          onClick={onDelete} 
          disabled={item.isBought} // Tiltás, ha az elem már meg van vásárolva
        >
          Törlés
        </button>
        {/* Elem megvásárlásként jelölése */}
        <button 
          className="tick-button" 
          onClick={onTick} 
          disabled={item.isBought} // Tiltás, ha az elem már meg van vásárolva
        >
          Pipa
        </button>
      </div>
    </div>
  );
}

import React from 'react'; 
import './leftpane.less'; 
import { shopListService, ShoppingListDTO } from './ClientService';
import { ListCard } from './Listcard'; 
import { OvalButton } from './OvalButton';

/**
 * A bal oldali panel, amely a bevásárlólistákat jeleníti meg.
 * @param selected A jelenleg kiválasztott lista (ha van).
 * @param onSelect Függvény a lista kiválasztásának kezelésére.
 */
export function LeftPane({ selected, onSelect }: {
  selected?: ShoppingListDTO,
  onSelect: (shoppinglist: ShoppingListDTO) => void
}) 
{
  return (
    <div class="left-pane">
      {/* Panel címsora */}
      <h2>Bevásárlólisták</h2>
      
      {/* Ovális gomb a címsor és a lista között */}
      <div class="add-list-button">
        <OvalButton
          text="Új lista hozzáadása" // Gomb szövege
          onClick={ shopListService.startNewList } // Új lista létrehozására hívott függvény
        />
      </div>

      {/* Bevásárlólista megjelenítése */}
      <div class="shopping-list">
        {shopListService.HouseHold.lists.length > 0 ? (
          // Ha vannak listák, akkor mindegyiket megjelenítjük egy ListCard komponensben
          shopListService.HouseHold.lists.map((list) => (
            <ListCard 
              list={list} // Lista adatai
              key={list.id} // Egyedi kulcs azonosító a React számára
              onSelect={() => onSelect(list)} // Lista kiválasztása
            />
          ))
        ) : (
          // Ha nincsenek listák, üzenet megjelenítése
          <p class="empty-list-message">Nincsenek bevásárlólisták.</p>
        )}
      </div>
    </div>
  );
}

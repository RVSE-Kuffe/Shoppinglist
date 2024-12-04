import { useState } from "preact/hooks"; 
import { shopListService, ShoppingListDTO } from "./ClientService";
import { ListItemCard } from "./Listitemcard"; 
import { OvalButton } from "./OvalButton"; 
import { PopupForm } from "./PopupForm";

/**
 * A középső panel, amely a kiválasztott bevásárlólista tartalmát jeleníti meg.
 * @param list A jelenleg kiválasztott bevásárlólista (ha van).
 */
export function MiddlePanel({ list }: { list?: ShoppingListDTO }) {
  // Állapot a felugró ablak láthatóságának kezelésére
  const [isPopupVisible, setPopupVisible] = useState(false);

  return (
    <div className="middle-panel">
      {list ? (
        <>
          {/* Lista címe és dátuma */}
          <h2 className="list-title">Bevásárlólista - {list.date}</h2>
          
          {/* Új tétel hozzáadása gomb */}
          <div className="add-button-container">
            <OvalButton
              text="Új tétel hozzáadása" // Gomb szövege
              onClick={() => setPopupVisible(true)} // Felugró ablak megnyitása
            />
          </div>
          
          {/* Rendezési gombok megjelenítése, ha vannak tételek */}
          {list.items.length > 0 && (
            <div className="action-buttons">
              {/* Rendezés fontosság szerint */}
              <button onClick={() => shopListService.sortList(list, "Importance")}>
                Fontosság
              </button>
              {/* Rendezés mennyiség szerint */}
              <button onClick={() => shopListService.sortList(list, "Count")}>
                Mennyiség
              </button>
              {/* Rendezés ABC sorrendben */}
              <button onClick={() => shopListService.sortList(list, "ABC")}>
                ABC
              </button>
            </div>
          )}

          {/* Listaelemek megjelenítése */}
          <div className="list-items">
            {list.items.length > 0 ? (
              // Listaelemek kártyák formájában
              list.items.map((item) => (
                <ListItemCard
                  key={item.name} // Egyedi kulcs az azonosításhoz
                  item={item} // Az aktuális listaelem
                  onDelete={() => shopListService.deleteFromList(item, list)} // Elem törlése
                  onTick={() => shopListService.tickItem(item, list)} // Elem megvásárlásként jelölése
                  onDecrease={() => shopListService.changeCount(item, -1)} // Darabszám csökkentése
                  onIncrease={() => shopListService.changeCount(item, 1)} // Darabszám növelése
                />
              ))
            ) : (
              // Üzenet, ha a listában nincsenek tételek
              <p className="empty-items-message">
                Nincsenek tételek ebben a listában.
              </p>
            )}
          </div>

          {/* Felugró űrlap megjelenítése új tétel hozzáadásához */}
          {isPopupVisible && (
            <PopupForm
              onClose={() => setPopupVisible(false)} // Felugró ablak bezárása
              onSubmit={(newItem) => {
                shopListService.addToList(newItem, list); // Új tétel hozzáadása a listához
              }}
            />
          )}
        </>
      ) : (
        // Üzenet, ha nincs kiválasztott lista
        <p className="no-list-selected-message">
          Nincs kiválasztott bevásárlólista.
        </p>
      )}
    </div>
  );
}

import React from "react"; 
import "./Listcard.less"; 
import { ShoppingListDTO } from "./ClientService"; 

/**
 * Egy bevásárlólistát megjelenítő kártya komponens.
 * @param list A megjelenítendő bevásárlólista adatai.
 * @param onSelect A lista kiválasztását kezelő függvény.
 */
export function ListCard({
  list,
  onSelect,
}: {
  list: ShoppingListDTO;
  onSelect: () => void;
}) {
  return (
    <div 
      class="list-card" // Stílusosztály a kártyához
      onClick={() => onSelect()} // Kiválasztás eseményének kezelése
    >
      {/* A lista dátuma */}
      <div class={`list-date ${list.completed ? "completed" : ""}`}>
        {list.date}
      </div>
      {/* Az elemek száma a listában */}
      <div class="list-items-count">Elemszám: {list.items.length}</div>
    </div>
  );
}

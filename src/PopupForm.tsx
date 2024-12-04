import React, { useState } from "react";
import "./popupform.less"; 
import { Importance, ListItemDTO } from "./ClientService";

// A PopupForm komponens deklarációja, amely új listaelem hozzáadására szolgál
export function PopupForm({
  onClose, // Callback függvény a popup bezárására
  onSubmit, // Callback függvény az új listaelem beküldésére
}: {
  onClose: () => void; // A onClose típusdefiníciója
  onSubmit: (item: ListItemDTO) => void; // Az onSubmit típusdefiníciója
}) {
  // Komponens állapotainak inicializálása useState hook segítségével
  const [name, setName] = useState(""); // A listaelem nevének állapota
  const [count, setCount] = useState(1); // A darabszám állapota (alapértelmezés: 1)
  const [importance, setImportance] = useState<Importance>(Importance.Medium); // A fontosság állapota (alapértelmezés: közepes)

  // Form beküldésének kezelése
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Alapértelmezett form küldésének megakadályozása
    const newItem: ListItemDTO = {
      name, // A listaelem neve
      count, // A darabszám
      importance, // A fontosság
      isBought: false, // Alapértelmezetten nincs megvéve
    };
    onSubmit(newItem); // Az új elem átadása az onSubmit callback-nek
    onClose(); // Popup bezárása
  };

  // Komponens JSX (HTML-szerű) struktúrája
  return (
    <div class="popup-form-overlay"> {/* A teljes popupot lefedő overlay */}
      <div class="popup-form"> {/* A popup tartalma */}
        <h3>Új listaelem hozzáadása</h3> {/* Popup cím */}
        <form onSubmit={handleSubmit}> {/* Form definíció */}
          <label>
            Név:
            <input
              type="text" // Szöveg típusú input mező a névhez
              value={name} // Az input mező értéke
              onChange={(e) => setName(e.currentTarget.value)} // Állapot frissítése bevitelnél
              required // Kötelező mező
            />
          </label>
          <label>
            Darabszám:
            <input
              type="number" // Szám típusú input mező a darabszámhoz
              value={count} // Az input mező értéke
              onChange={(e) => setCount(Number(e.currentTarget.value))} // Állapot frissítése bevitelnél
              min="1" // Minimum érték: 1
              required // Kötelező mező
            />
          </label>
          <label>
            Fontosság:
            <select
              value={importance} // Az input értéke
              onChange={(e) =>
                setImportance(e.currentTarget.value as Importance) // Állapot frissítése a kiválasztás alapján
              }
            >
              <option value={Importance.High}>Magas</option> {/* Opció: Magas fontosság */}
              <option value={Importance.Medium}>Közepes</option> {/* Opció: Közepes fontosság */}
              <option value={Importance.Low}>Alacsony</option> {/* Opció: Alacsony fontosság */}
            </select>
          </label>
          <div class="popup-form-buttons"> {/* Gombok csoportja */}
            <button type="submit">Hozzáadás</button> {/* Beküldés gomb */}
            <button type="button" onClick={onClose}> {/* Mégse gomb */}
              Mégse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

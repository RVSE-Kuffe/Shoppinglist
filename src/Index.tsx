import { render } from "preact"; 
import './index.less'; 
import { LeftPane } from "./Leftpane"; 
import { MiddlePanel } from "./MiddlePanel"; 
import { shopListService, ShoppingListDTO } from "./ClientService";
import React, { useEffect, useState } from "react"; 
import { RightPane } from "./RightPane"; 

/**
 * Az alkalmazás fő komponense.
 */
function App() {
  // Állapotkezelés a kiválasztott bevásárlólista számára
  const [selectedList, setSelectedList] = useState<ShoppingListDTO>();

  // Az újrarenderelés számlálója
  let [renderCount, setRenderCount] = useState(1);

  // Oldalhallgatók kezelése és frissítése az állapotváltozások alapján
  useEffect(() => {
    // Figyelő hozzáadása a ShopListService-hez
    const listener = () => setRenderCount(x => x + 1); // Render számláló növelése
    shopListService.addListener(listener);
    return () => shopListService.removeListener(listener); // Figyelő eltávolítása a komponens unmount esetén
  }, []);

  return (
    <div class="app-container">
      {/* Bal oldali panel, a lista kiválasztásához */}
      <LeftPane selected={selectedList} onSelect={setSelectedList} />
      {/* Középső panel, a kiválasztott lista tartalmának megjelenítéséhez */}
      <MiddlePanel list={selectedList} />
      {/* Jobb oldali panel, kiegészítő funkciókkal */}
      <RightPane />
    </div>
  );
}

// Az alkalmazás renderelése az "app" azonosítójú DOM elembe
render(<App />, document.getElementById("app"));

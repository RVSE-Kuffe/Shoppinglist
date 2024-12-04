import React from 'react';
import './rightpane.less'; 
import { OwnedItemCard } from './OwnedItemCard';
import { shopListService } from './ClientService';

// RightPane komponens deklarációja
export function RightPane() {
  return (
    <div class="right-pane"> {/* A jobb oldali panel fő konténere */}
      <h3 class="pane-title">Kamra tartalma</h3> {/* A panel címe */}
      <div class="item-list"> {/* Az elemek listájának konténere */}
        {shopListService.HouseHold.ownedItems.length > 0 ? ( 
          // Ha vannak elemek a kamrában, akkor ezeket megjelenítjük
          shopListService.HouseHold.ownedItems.map((item) => (
            <OwnedItemCard 
              key={item.name} // Az elem egyedi kulcsa (React optimalizációhoz)
              item={item} // Az aktuális elem átadása a OwnedItemCard komponensnek
              onDecrease={() => shopListService.changeOwnedCount(item, -1)} 
              // Callback függvény, amely csökkenti az adott elem darabszámát
            />
          ))
        ) : (
          // Ha nincsenek elemek, akkor egy üres üzenetet jelenítünk meg
          <p class="empty-message">A kamra üres :(</p>
        )}
      </div>
    </div>
  );
}


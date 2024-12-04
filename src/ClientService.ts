// Ez a fájl tartalmazza a bevásárlólisták adatforrását és logikáját

/**
 * A háztartás adatait reprezentáló DTO.
 * @property lists A háztartás által kezelt bevásárlólisták.
 * @property ownedItems Az összes meglévő, háztartásban tárolt tétel.
 */
export type HouseHoldDTO = {
  lists: ShoppingListDTO[];
  ownedItems: ListItemDTO[];
};

/**
 * Egy bevásárlólistát reprezentáló DTO.
 * @property id Egyedi azonosítója a listának.
 * @property date A lista létrehozásának dátuma (YYYY-MM-DD formátum).
 * @property completed Jelzi, hogy a lista be van-e fejezve.
 * @property items A lista elemei.
 */
export type ShoppingListDTO = {
  id: number;
  date: string;
  completed: boolean;
  items: ListItemDTO[];
};

/**
 * Egy lista elemét reprezentáló DTO.
 * @property name Az elem neve.
 * @property count Az elem mennyisége.
 * @property importance Az elem fontossági szintje.
 * @property isBought Jelzi, hogy az elem meg lett-e vásárolva.
 */
export type ListItemDTO = {
  name: string;
  count: number;
  importance: Importance;
  isBought: boolean;
};

/**
 * A lista elemeinek fontossági szintjeit leíró enum.
 * @enum High A legmagasabb fontosság.
 * @enum Medium Közepes fontosság.
 * @enum Low Alacsony fontosság.
 */
export enum Importance {
  High = "high",
  Medium = "medium",
  Low = "low",
}

/**
 * A fontossági szintek sorrendjét meghatározó objektum.
 * Az alacsonyabb érték nagyobb fontosságot jelent.
 */
const importanceOrder: Record<Importance, number> = {
  [Importance.High]: 1,
  [Importance.Medium]: 2,
  [Importance.Low]: 3,
};

/**
 * A háztartás adatainak mentése a böngésző localStorage-jába.
 * @param household A mentendő háztartási adatok.
 */
export const saveToLocal = (household: HouseHoldDTO) => {
  const persistentHouseHold = JSON.stringify(household);
  localStorage.setItem("household", persistentHouseHold); // Mentés a localStorage-ba
};

/**
 * A háztartás adatainak betöltése a böngésző localStorage-jából.
 * Ha nincs mentett adat, egy új szolgáltatást hoz létre.
 * @returns A betöltött vagy újonnan létrehozott ShopListService példány.
 */
export const loadFromLocal = (): ShopListService => {
  const persistentHouseHold = localStorage.getItem("household");
  const newService = new ShopListService();
  if (persistentHouseHold) {
    newService.HouseHold = JSON.parse(persistentHouseHold);
  }
  return newService;
};

/**
 * Bevásárlólistákat kezelő szolgáltatás.
 * Feladata a listák létrehozása, módosítása, és állapotuk kezelése.
 */
class ShopListService {
  /**
   * A háztartás jelenlegi állapota.
   */
  HouseHold: HouseHoldDTO = { lists: [], ownedItems: [] };

  /**
   * Az eseményfigyelők listája.
   */
  #listeners: (() => void)[] = [];

  /**
   * Új bevásárlólista létrehozása a mai dátummal.
   */
  startNewList = () => {
    const newList: ShoppingListDTO = {
      id: Date.now(), // Egyedi azonosító
      date: new Date().toISOString().split("T")[0], // Mai dátum (YYYY-MM-DD formátum)
      completed: false,
      items: [], // Üres lista
    };
    this.HouseHold.lists.push(newList);
    this.notifyListeners();
  };

  /**
   * Új elem hozzáadása egy megadott bevásárlólistához.
   * @param newItem A hozzáadni kívánt elem.
   * @param list A célzott bevásárlólista.
   */
  addToList = (newItem: ListItemDTO, list: ShoppingListDTO) => {
    list.items.push(newItem);
    this.checkIfDone(list);
    this.notifyListeners();
  };

  /**
   * Elem eltávolítása egy megadott bevásárlólistáról.
   * @param item Az eltávolítani kívánt elem.
   * @param list A célzott bevásárlólista.
   */
  deleteFromList = (item: ListItemDTO, list: ShoppingListDTO) => {
    list.items = list.items.filter((x) => x !== item);
    this.checkIfDone(list);
    this.notifyListeners();
  };

  /**
   * Elem megjelölése megvásároltként és hozzáadása a háztartási készlethez.
   * @param item A megjelölni kívánt elem.
   * @param list Az elem eredeti listája.
   */
  tickItem = (item: ListItemDTO, list: ShoppingListDTO) => {
    item.isBought = true;
    this.checkIfDone(list);
    for (let i of this.HouseHold.ownedItems) {
      if (i.name === item.name) {
        i.count += item.count;
        this.notifyListeners();
        return;
      }
    }
    let newItem: ListItemDTO = {
      name: item.name,
      count: item.count,
      importance: item.importance,
      isBought: true,
    };
    this.HouseHold.ownedItems.push(newItem);
    this.notifyListeners();
  };

  /**
   * Ellenőrzi, hogy az adott lista teljes mértékben be van-e fejezve.
   * @param list Az ellenőrizendő bevásárlólista.
   */
  checkIfDone = (list: ShoppingListDTO) => {
    for (let item of list.items) {
      if (!item.isBought) {
        list.completed = false;
        this.notifyListeners();
        return;
      }
    }
    list.completed = true;
    this.notifyListeners();
  };

  /**
   * Egy meglévő elem mennyiségének megváltoztatása a háztartási készletben.
   * @param item A módosítandó elem.
   * @param count Az új mennyiség.
   */
  changeOwnedCount = (item: ListItemDTO, count: number) => {
    item.count += count;

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Értesítési engedély megadva.");
      } else {
        console.warn("Az értesítési engedély nem lett megadva.");
      }
    });

    if (Notification.permission === "granted" && item.count === 1) {
      new Notification("Figyelem!", {
        body: `Mindjárt elfogy a(z) ${item.name}!`,
      });
    } else {
      console.warn("Értesítési engedély nincs megadva.");
    }

    this.notifyListeners();
  };

  /**
   * Egy listaelem mennyiségének módosítása egy adott listában.
   * @param item A módosítandó elem.
   * @param count Az új mennyiség.
   */
  changeCount = (item: ListItemDTO, count: number) => {
    item.count += count;
    this.notifyListeners();
  };

  /**
   * Lista rendezése megadott feltétel szerint.
   * @param list A rendezendő lista.
   * @param cond A rendezés feltétele ("Importance", "ABC", vagy "Count").
   */
  sortList = (list: ShoppingListDTO, cond: string) => {
    let oldList = [...list.items];
    switch (cond) {
      case "Importance":
        list.items.sort(
          (a, b) =>
            importanceOrder[a.importance] - importanceOrder[b.importance]
        );
        break;
      case "ABC":
        list.items.sort();
        break;
      case "Count":
        list.items.sort((a, b) => a.count - b.count);
        break;
    }
    if (JSON.stringify(oldList) === JSON.stringify(list.items)) {
      list.items.reverse();
    }
    this.notifyListeners();
  };

  /**
   * Új eseményfigyelő hozzáadása.
   * @param listener Az eseményfigyelő függvény.
   */
  addListener(listener: () => void) {
    this.#listeners = [...this.#listeners, listener];
  }

  /**
   * Eseményfigyelő eltávolítása.
   * @param listener Az eltávolítandó eseményfigyelő függvény.
   */
  removeListener(listener: () => void) {
    this.#listeners = this.#listeners.filter((x) => x !== listener);
  }

  /**
   * Értesíti az összes eseményfigyelőt, és elmenti az aktuális állapotot.
   */
  private notifyListeners() {
    this.#listeners.forEach((listener) => listener());
    saveToLocal(this.HouseHold);
  }
}

/**
 * Globális példány a ShopListService-ből, a localStorage-ból betöltve.
 */
export const shopListService = loadFromLocal();

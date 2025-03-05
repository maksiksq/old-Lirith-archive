import {type IDBPDatabase, openDB} from "idb";
// this is a helper file for IndexDB cause if I do that in that huge component too im gonna die

const DB_NAME = "dataDB";
const STORE_NAME = "shelves";

async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        },
    });
}

export async function saveShelf(shelf: any) {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.put(STORE_NAME, shelf)
}

export async function getShelf(id: number) {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.get(STORE_NAME, id)
}
export async function getAllShelves(shelf: any) {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.getAll(STORE_NAME)
}

export async function deleteShelf(id: number) {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.delete(STORE_NAME, id);
}

export async function clearShelves(ves: any) {
    const db: IDBPDatabase<unknown> = await initDB();
    await db.clear(STORE_NAME);
}
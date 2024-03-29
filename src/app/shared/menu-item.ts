import { Injectable } from "@angular/core";

export interface Menu {
    state: string
    name: string
    type: string
    icon: string
    role: string
}
const MENUITEMS = [
    { state: 'dashboard', name: 'dashboard', type: 'link', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Manage Category', type: 'link', icon: 'category', role: 'ADMIN' },
    { state: 'product', name: 'Manage Product', type: 'link', icon: 'inventory_2', role: 'ADMIN' },
    { state: 'order', name: 'Manage Order', type: 'link', icon: 'shopping_cart', role: '' },
    { state: 'bill', name: 'View Bill', type: 'link', icon: 'backup_table', role: '' }
]
@Injectable()
export class MenuItems {
    getMenuitem(): Menu[] {
        return MENUITEMS;
    }
}
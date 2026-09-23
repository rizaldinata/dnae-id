import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { MenuItemModel } from '../models/MenuItemModel';
import { SupabaseMenuDataSource } from '../datasources/SupabaseMenuDataSource';

export class MenuRepositoryImpl extends IMenuRepository {
  async getMenuItems(category = null) {
    const rawData = await SupabaseMenuDataSource.getMenuItems(category);
    return rawData.map((item) => MenuItemModel.fromJson(item));
  }

  async saveMenuItem(menuItem) {
    const json = MenuItemModel.toJson(menuItem);
    const savedJson = await SupabaseMenuDataSource.saveMenuItem(json);
    return MenuItemModel.fromJson(savedJson);
  }

  async updateMenuItem(id, menuItem) {
    const json = MenuItemModel.toJson(menuItem);
    const updatedJson = await SupabaseMenuDataSource.updateMenuItem(id, json);
    return MenuItemModel.fromJson(updatedJson);
  }

  async deleteMenuItem(id) {
    return await SupabaseMenuDataSource.deleteMenuItem(id);
  }
}

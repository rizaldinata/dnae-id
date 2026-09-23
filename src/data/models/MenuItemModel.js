import { MenuItem } from '../../domain/entities/MenuItem';

export class MenuItemModel {
  static fromJson(json) {
    return new MenuItem({
      id: json.id,
      name: json.name,
      description: json.description,
      price: Number(json.price),
      category: json.category || 'Manis',
      imageUrl: json.image_url || json.imageUrl || '',
      isAvailable: json.is_available !== undefined ? json.is_available : (json.isAvailable !== undefined ? json.isAvailable : true),
      isBestSeller: json.is_bestseller !== undefined ? json.is_bestseller : (json.isBestSeller !== undefined ? json.isBestSeller : false),
      isNew: json.is_new !== undefined ? json.is_new : (json.isNew !== undefined ? json.isNew : false),
      stock: json.stock !== undefined ? Number(json.stock) : 0,
    });
  }

  static toJson(item) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.imageUrl,
      is_available: item.isAvailable,
      is_bestseller: item.isBestSeller,
      is_new: item.isNew,
      stock: item.stock,
    };
  }
}

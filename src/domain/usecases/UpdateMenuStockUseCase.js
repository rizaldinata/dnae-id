export class UpdateMenuStockUseCase {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(menuId, newStock) {
    if (typeof newStock !== 'number' || newStock < 0 || !Number.isInteger(newStock)) {
      throw new Error('Stock harus berupa angka bulat positif');
    }

    const items = await this.menuRepository.getMenuItems();
    const item = items.find((i) => i.id === menuId);
    if (!item) {
      throw new Error('Menu tidak ditemukan');
    }

    const updatedItem = { ...item, stock: newStock };
    await this.menuRepository.updateMenuItem(menuId, updatedItem);
    return updatedItem;
  }
}

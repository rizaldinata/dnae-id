/**
  * Interface IMenuRepository
  */
export class IMenuRepository {
  async getMenuItems(category = null) {
    throw new Error('Method getMenuItems() must be implemented');
  }
  async saveMenuItem(item) {
    throw new Error('Method saveMenuItem() must be implemented');
  }
  async updateMenuItem(id, item) {
    throw new Error('Method updateMenuItem() must be implemented');
  }
  async deleteMenuItem(id) {
    throw new Error('Method deleteMenuItem() must be implemented');
  }
}

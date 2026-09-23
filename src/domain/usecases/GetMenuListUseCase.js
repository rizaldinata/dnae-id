export class GetMenuListUseCase {
  constructor(menuRepository) {
    this.menuRepository = menuRepository;
  }

  async execute(categoryFilter = 'Semua') {
    return await this.menuRepository.getMenuItems(categoryFilter);
  }
}

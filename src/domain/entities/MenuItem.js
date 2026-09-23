export class MenuItem {
  constructor({
    id,
    name,
    description,
    price,
    category = 'Manis', // Manis, Gurih, Premium, Minuman
    imageUrl = '',
    isAvailable = true,
    isBestSeller = false,
    isNew = false,
    stock = 0,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.imageUrl = imageUrl;
    this.isAvailable = isAvailable;
    this.isBestSeller = isBestSeller;
    this.isNew = isNew;
    this.stock = stock;
  }

  getFormattedPrice() {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(this.price);
  }
}

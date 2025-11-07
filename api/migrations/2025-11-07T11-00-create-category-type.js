/**
 * Migration: Create Category content type
 *
 * Creates the Category content type for organizing Moneybox products
 * into logical groups (ISAs, Pensions, Savings, Investments).
 */

module.exports = function (migration) {
  const category = migration.createContentType('category', {
    name: 'Category',
    description: 'Product categories for the Moneybox catalog',
    displayField: 'name',
  });

  category.createField('name', {
    name: 'Name',
    type: 'Symbol',
    required: true,
    validations: [
      {
        size: { min: 1, max: 100 }
      }
    ]
  });

  category.createField('description', {
    name: 'Description',
    type: 'RichText',
    required: false,
  });

  category.createField('order', {
    name: 'Order',
    type: 'Integer',
    required: true,
    validations: [
      {
        range: { min: 0 }
      }
    ]
  });
};

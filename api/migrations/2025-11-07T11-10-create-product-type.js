/**
 * Migration: Create Product content type
 *
 * Creates the Product content type for Moneybox financial products.
 * Each product belongs to a category and includes an image and description.
 */

module.exports = function (migration) {
  const product = migration.createContentType('product', {
    name: 'Product',
    description: 'Financial products in the Moneybox catalog',
    displayField: 'name',
  });

  product.createField('name', {
    name: 'Name',
    type: 'Symbol',
    required: true,
    validations: [
      {
        size: { min: 1, max: 200 }
      }
    ]
  });

  product.createField('description', {
    name: 'Description',
    type: 'RichText',
    required: true,
  });

  product.createField('category', {
    name: 'Category',
    type: 'Link',
    linkType: 'Entry',
    required: true,
    validations: [
      {
        linkContentType: ['category']
      }
    ]
  });

  product.createField('image', {
    name: 'Image',
    type: 'Link',
    linkType: 'Asset',
    required: true,
    validations: [
      {
        linkMimetypeGroup: ['image']
      }
    ]
  });
};

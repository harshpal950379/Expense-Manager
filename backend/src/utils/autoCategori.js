// Auto-categorization logic based on keywords
const CATEGORY_KEYWORDS = {
  Food: ['zomato', 'swiggy', 'restaurant', 'pizza', 'burger', 'cafe', 'food', 'grocery', 'supermarket', 'bakery', 'tea', 'coffee', 'lunch', 'dinner', 'breakfast'],
  Travel: ['uber', 'ola', 'cab', 'taxi', 'flight', 'bus', 'train', 'metro', 'petrol', 'gas', 'toll', 'parking', 'travel', 'railway'],
  Entertainment: ['movie', 'cinema', 'netflix', 'spotify', 'games', 'concert', 'ticket', 'theater', 'show', 'entertainment', 'outing'],
  Shopping: ['amazon', 'flipkart', 'mall', 'market', 'store', 'shop', 'clothing', 'clothes', 'dress', 'shoe', 'shoes', 'purchase', 'buy'],
  Utilities: ['electricity', 'water', 'internet', 'phone', 'mobile', 'bill', 'rent', 'electricity bill', 'utility'],
  Health: ['hospital', 'doctor', 'medicine', 'pharmacy', 'health', 'medical', 'clinic', 'dental', 'gym', 'fitness'],
  Education: ['school', 'college', 'tuition', 'book', 'course', 'online', 'udemy', 'education', 'study'],
};

const autoCategorizeExpense = (note, description) => {
  const text = (note + ' ' + description).toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Other';
};

module.exports = autoCategorizeExpense;

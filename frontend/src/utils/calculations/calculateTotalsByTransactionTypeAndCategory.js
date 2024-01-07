function calculateTotalsByTransactionTypeAndCategory(transactions) {
    //this will be the object that will hold the totals by year
    const totalsByYear = {};
    transactions.forEach((transaction) => { 
        const { date, transaction_type, category, amount } = transaction;
        const amountFloat = parseFloat(amount); 
        const year = new Date(date).getFullYear();
        const month = new Date(date).toLocaleString('default', { month: 'short' });

        
        //Transaction Type
        // Initialize the totalByYear object for each year  
        if (!totalsByYear[year]) {
            totalsByYear[year] = {};
        }
        
        // Then initialize the totalByYear object with each month for each year
        if (!totalsByYear[year][month]) {
            totalsByYear[year][month] = { Net: 0 };
        }

        // I think this might already be done in the previous step??
        // Initialize the totalByYear object with each transaction type for the corresponding year and month
        if (!totalsByYear[year][month][transaction_type]) {
            totalsByYear[year][month][transaction_type] = 0;
        }

        // Add the amount to the corresponding transaction type total for the corresponding year and month
        totalsByYear[year][month][transaction_type] += amountFloat;
        
        // Calculate the Net difference for the corresponding year and month
        totalsByYear[year][month].Net = (totalsByYear[year][month].Income || 0) - (totalsByYear[year][month].Expense || 0);
        totalsByYear[year][month].Net = parseFloat(totalsByYear[year][month].Net.toFixed(2));

        
        //EXPENSE CATEGORY
        // Initialize the totalByYear object with each Category
        if (!totalsByYear[year][month][category] && transaction_type === 'Expense') {
                totalsByYear[year][month][category] = 0;
        } 

        // Add the amount to the corresponding Expense Category total for the corresponding year and month
        if (!totalsByYear[year][month][category] && transaction_type === 'Expense') {
            totalsByYear[year][month][category] += amountFloat;
        }
        
    });    
    return totalsByYear;
};

export default calculateTotalsByTransactionTypeAndCategory;
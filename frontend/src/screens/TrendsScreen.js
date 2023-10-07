import React, { useEffect, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Label } from 'recharts';
import { Form, Accordion } from 'react-bootstrap';
import axios from 'axios';
import Loader from '../components/Loader';

function TrendsScreen() {

    //Local state set up
    const [transactions, setTransactions] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);

    const filteredTransactionsByYear = selectedYear
        ? transactions.filter(transaction => transaction.year === selectedYear)
        : transactions;

    //Make a set containing all available years for use in Form.Select so I don't have to hard-code all the year values in the select drop down
    const availableYears = [...new Set(transactions.map(transaction => transaction.year))];
    
    //API call to get all transactions
    useEffect(() => {
      async function fetchTransactions() {
        try {
          const response = await axios.get('/api/transactions/');
          const data = response.data;
          setTransactions(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching transactions:', error);
          setLoading(false);
        }
      }
    
      fetchTransactions();
    }, []);
    console.log('these are all the transactions: ', transactions);
    
    //If loading is true, return the Loader component
    if (loading) {
      return <Loader />
    }

    function calculateTotalsByYear(transactions) {

        //this will be the object that will hold the totals by year
        const totalsByYear = {};

        transactions.forEach((transaction) => { 

            const { year, month, transaction_type, amount } = transaction;

            const amountFloat = parseFloat(amount); 

            // Initialize the totalByYear object with each year  
            if (!totalsByYear[year]) {
                totalsByYear[year] = {};
            }
            
            // Initialize the totalByYear object with each month for each corresponding year
            if (!totalsByYear[year][month]) {
                //OLD -> totalsByYear[year][month] = { income: 0, expense: 0, investment: 0, net: 0 };
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
            totalsByYear[year][month].Net = (totalsByYear[year][month].Deposit || 0) - (totalsByYear[year][month].Expense || 0);
            
        });
        console.log('current totals by year', totalsByYear);
        return totalsByYear;
    };

    const yearlyTotalsByMonthAndTransactionType = calculateTotalsByYear(filteredTransactionsByYear);

    //Creates a new array of objects where each object includes the year, month, and the totals by transaction type for each year and month
    const barChartDataByTransactionType = [];
    for (const year in yearlyTotalsByMonthAndTransactionType) {
        for (const month in yearlyTotalsByMonthAndTransactionType[year]) {
            const dataPoints = {
                year: year,
                month: month,
                ...yearlyTotalsByMonthAndTransactionType[year][month],
            };
            barChartDataByTransactionType.push(dataPoints);
        }
    }
    console.log('this is the bar chart data by transaction type: ', barChartDataByTransactionType);

    //Creates a new object where it separates out the transaction type totals and creates a new date field that includes 
    //the month and year. This is done so that the bar chart can be displayed with the month and year on the x-axis
    const barChartDataByTransactionTypeWithDate = barChartDataByTransactionType.map((item) => ({
        ...item,
        date: `${item.month} ${item.year}`,
      }));

    return (

        <div>
            <h1 className='my-3'>Cashflow Trends</h1>

            <Accordion.Header>
            <Form.Select 
            
            aria-label="Default select example"
            onChange={(e) => {setSelectedYear(e.target.value)}}
            value={selectedYear}

          >
            <option value="">Select a year</option>
            {availableYears.map(year => (
                <option key={year} value={year}>
                    {year}
                </option>
            ))}
            </Form.Select>
            </Accordion.Header>

            <BarChart
            width={500}
            height={300}
            data={ barChartDataByTransactionTypeWithDate }
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis  
                    dataKey = "date"
                >
                    <Label value="Date" position="insideBottom" offset={-5} />
                </XAxis>
                <YAxis  unit="$">
                    <Label value="USD" position="left" offset={-7}/>
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey= "Deposit" fill="#82ca9d" />
                <Bar dataKey= "Expense" fill="#8884d8" />
                <Bar dataKey= "Investment" fill="#ab56d8" />
                <Bar dataKey= "Net" fill="#ffc658" /> 
            </BarChart>

           

        </div>
    
    );
}

export default TrendsScreen
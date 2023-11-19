import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'; 
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Label } from 'recharts';
import { Dropdown } from 'react-bootstrap';
import Loader from '../components/Loader';
import { fetchTransactions } from '../utils/api';
import { transactionSelector } from '../features/transactionSlice';
import AlertMessage from '../components/AlertMessage';

function TrendsScreen() {

    const { userInfo } = useSelector((state) => state.auth);
    const { transactions, loading, error } = useSelector(transactionSelector);
    const dispatch = useDispatch();
    const [selectedYear, setSelectedYear] = useState('');

    const filteredTransactionsByYear = selectedYear
        ? transactions.filter(transaction => transaction.year === selectedYear)
        : transactions;

    //Make a set containing all available years for use in Form.Select so I don't have to hard-code all the year values in the select drop down
    const availableYears = [...new Set(transactions.map(transaction => transaction.year))];
    
    useEffect(() => {
      if (userInfo) {
        fetchTransactions(userInfo, dispatch)
      }
    }, [userInfo, dispatch]);
    console.log('these are all the transactions: ', transactions);
    
    //If loading is true, return the Loader component
    if (loading) {
      return <Loader />
    }

    if (error) {
      return <AlertMessage variant='danger' message={error.message} />
    }

    function calculateTotalsByYear(transactions) {
        //this will be the object that will hold the totals by year
        const totalsByYear = {};
        transactions.forEach((transaction) => { 
            const { year, month, transaction_type, category, amount } = transaction;
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

            //***NEW, NOV 19 2023***
            // Calculate the totals by category for each month
            if (!totalsByYear[year][month][category]) {
                totalsByYear[year][month][category] = 0;
                }
            totalsByYear[year][month][category] += amountFloat;
        });
        console.log('current totals by year', totalsByYear);
        return totalsByYear;
    };

    const yearlyTotalsByMonthAndTransactionTypeAndCategory = calculateTotalsByYear(filteredTransactionsByYear);

    //Creates a new array of objects where each object includes the year, month, and the totals by transaction type for each year and month
    const barChartDataByTransactionTypeAndCategory = [];
    for (const year in yearlyTotalsByMonthAndTransactionTypeAndCategory) {
        for (const month in yearlyTotalsByMonthAndTransactionTypeAndCategory[year]) {
            const dataPoints = {
                year: year,
                month: month,
                ...yearlyTotalsByMonthAndTransactionTypeAndCategory[year][month],
            };
            barChartDataByTransactionTypeAndCategory.push(dataPoints);
        }
    }
    console.log('this is the bar chart data by transaction type: ', barChartDataByTransactionTypeAndCategory);

    //Creates a new object where it separates out the transaction type totals and creates a new date field that includes 
    //the month and year. This is done so that the bar chart can be displayed with the month and year on the x-axis
    const barChartDataByTransactionTypeAndCategoryWithDate = barChartDataByTransactionTypeAndCategory.map((item) => ({
        ...item,
        date: `${item.month} ${item.year}`,
      }));
    console.log('this is the bar chart data by transaction type with date: ', barChartDataByTransactionTypeAndCategoryWithDate);

    return (

        <div>
            <h1 className='my-3'><strong>Cashflow Trends</strong></h1>
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="primary" id="year-dropdown">
                    Select a year
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedYear('')}>All Years</Dropdown.Item>
                    {availableYears.map(year => (
                        <Dropdown.Item key={year} onClick={() => setSelectedYear(year)}>
                        {year}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>

        <div>
            <h3 className='my-3 py-3'><strong>Overall Breakdown By Month</strong></h3>

            <BarChart
            width={500}
            height={300}
            data={ barChartDataByTransactionTypeAndCategoryWithDate }
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
        <div>
            <h3 className='my-3 py-3'><strong>Breakdown By Category and Month</strong></h3>

            <BarChart
            width={500}
            height={300}
            data={ barChartDataByTransactionTypeAndCategoryWithDate }
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
                <Bar dataKey= "Going out & Eating out" fill="#82ca9d" />
                <Bar dataKey= "Rent & Utilities" fill="#8884d8" />
                <Bar dataKey= "Loans" fill="#ab56d8" />
                <Bar dataKey= "Savings & Investments" fill="#ffc658" />
                <Bar dataKey= "Car & Gas & Auto Insurance" fill="#85cd9a" />
                <Bar dataKey= "Travel & Personal & Other" fill="#59fedc" />
                <Bar dataKey= "Subscriptions" fill="#3dcafe" />
                <Bar dataKey= "Groceries" fill="#ed34fa" />
                <Bar dataKey= "Income" fill="#82ca9d" />

            </BarChart>

           

        </div>

    </div>
    
    );
}

export default TrendsScreen
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'; 
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Label } from 'recharts';
import { Dropdown } from 'react-bootstrap';
import Loader from '../components/Loader';
import { fetchTransactions } from '../utils/api';
import { transactionSelector } from '../features/transactionSlice';
import AlertMessage from '../components/AlertMessage';
import calculateTotalsByTransactionTypeAndCategory from '../utils/calculations/calculateTotalsByTransactionTypeAndCategory';

function TrendsScreen() {

    const { userInfo } = useSelector((state) => state.auth);
    const { transactions, loading, error } = useSelector(transactionSelector);
    const dispatch = useDispatch();
    const [selectedYear, setSelectedYear] = useState('');

    const filteredTransactionsByYear = selectedYear
        ? transactions.filter(transaction => transaction.date.slice(0,4) === selectedYear)
        : transactions;

    //Make a set containing all available years for use in Form.Select so I don't have to hard-code all the year values in the select drop down
    const availableYears = [...new Set(transactions.map(transaction => transaction.date.slice(0,4)))];
    
    useEffect(() => {
      if (userInfo) {
        fetchTransactions(userInfo, dispatch)
      }
    }, [userInfo, dispatch]);
    
    //If loading is true, return the Loader component
    if (loading) {
      return <Loader />
    }

    if (error) {
      return <AlertMessage variant='danger' message={error.message} />
    }

    const yearlyTotalsByMonthAndTransactionTypeAndCategory = calculateTotalsByTransactionTypeAndCategory(filteredTransactionsByYear);

    //Transforms the object into an array of objects where each object includes the year, month, and the totals by transaction type and category for each year and month
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

    //Creates a new object where it separates out the transaction_type totals and creates a new date field that includes 
    //the month and year. This is done so that the bar chart can be displayed with the month and year on the x-axis
    const barChartDataByTransactionTypeAndCategoryWithDate = barChartDataByTransactionTypeAndCategory.map((item) => ({
        ...item,
        date: `${item.month} ${item.year}`,
      }));

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
            width={1200}
            height={400}
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
                <Bar dataKey= "Income" fill="#82ca9d" />
                <Bar dataKey= "Expense" fill="#FF6961" />
                <Bar dataKey= "Investment" fill="#ADD8E6" />
                <Bar dataKey= "Net" fill="#ffc658" /> 
            </BarChart>

           

        </div>
        <div>
            <h3 className='my-3 py-3'><strong>Breakdown By Category and Month</strong></h3>

            <BarChart
            width={1200}
            height={400}
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
                <Bar dataKey= "Going out & Eating out" fill="#FF6961" />
                <Bar dataKey= "Rent & Utilities" fill="#FF6961" />
                <Bar dataKey= "Loans" fill="#FF6961" />
                <Bar dataKey= "Car & Gas & Auto Insurance" fill="#FF6961" />
                <Bar dataKey= "Travel & Personal & Other" fill="#FF6961" />
                <Bar dataKey= "Subscriptions" fill="#FF6961" />
                <Bar dataKey= "Groceries" fill="#FF6961" />
                <Bar dataKey= "Investment" fill="#ADD8E6" />
                <Bar dataKey= "Income" fill="#82ca9d" />

            </BarChart>

        </div>

    </div>
    
    );
}

export default TrendsScreen
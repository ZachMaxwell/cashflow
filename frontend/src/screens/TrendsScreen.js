import React, { useEffect, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, Label } from 'recharts';
import { Link } from 'react-router-dom';
import axios from 'axios'

function TrendsScreen() {

    //API call to get all transactions
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
    
    if (loading) {
      return <div>Loading...</div>;
    }
    //END API call

    //***code below covers the "Income, Expense, Investment, Net" bar chart 
    const groupedMonthlyData = transactions.reduce((total, item) => {
        const { month, transaction_type, amount } = item;
        if (!total[month]) {
            total[month] = { month, income: 0, expense: 0, investment: 0, net: 0 };
        }
        if (transaction_type === "Deposit") {
            total[month].income += amount;
            console.log('this is the income: ', total[month].income);
        } else if (transaction_type === "Expense") {
            total[month].expense += amount;
            console.log('this is the expense: ', total[month].expense);
        } else if (transaction_type === "Investment") {
            total[month].investment += amount;
        }
        total[month].net = total[month].income - total[month].expense;
        return total;
    }, {});

    const combinedMonthlyData = Object.values(groupedMonthlyData);
    console.log('This is the combined monthly data: ', combinedMonthlyData);
    //END categorysection

    //***code below covers the breakdown by CATEGORY of expenses
    const groupedCategoryData = transactions.reduce((total, item) => {
        const { month, category, transaction_type, amount } = item;
        
        
            if (!total[month]) {
                total[month] = {};
            }
            if (transaction_type === "expense") {
                if (!total[month][category]) {
                    total[month][category] = 0;
                }
            total[month][category] += amount;
            } 
        console.log(total);    
        return total;
        

    }, {});
        
    const combinedCategoryData = Object.entries(groupedCategoryData).map(([month, categoryData]) => {
       return { month, ...categoryData };
    });

    console.log(combinedCategoryData);

    // END category section

    return (

        <div>
            <h1 className='my-3'>All-Time Cashflow</h1>     
            
            <Link to="/" className="btn btn-primary">Home</Link>  

            <BarChart
            width={500}
            height={300}
            data={ combinedMonthlyData }
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis  dataKey= "month">
                    <Label value="Month" position="insideBottom" offset={-5} />
                </XAxis>
                <YAxis  unit="$">
                    <Label value="USD" position="left" offset={-7}/>
                </YAxis>
                <Tooltip />
                <Legend />
                <Bar dataKey= "income" fill="#82ca9d" />
                <Bar dataKey= "expense" fill="#8884d8" />
                <Bar dataKey= "investment" fill="#ab56d8" />
                <Bar dataKey= "net" fill="#ffc658" /> 
            </BarChart>

            
            <BarChart
            width={500}
            height={300}
            data={ combinedCategoryData }
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis  dataKey= "month">
                    <Label value="Month" position="insideBottom" offset={-5} />
                </XAxis>
                <YAxis  unit="$">
                    <Label value="USD" position="left" offset={-7}/>
                </YAxis>
                <Tooltip />
                <Legend />

                {Object.keys(combinedCategoryData[0]).filter(key => key !== "month").map((key, index) => (
                   <Bar key={index} dataKey= {key} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                ))}

                
              
            </BarChart>

        </div>
    
    );
}

export default TrendsScreen
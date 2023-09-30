
import { Container } from 'react-bootstrap'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import TrendsScreen from './screens/TrendsScreen'
import NetworthScreen from './screens/NetworthScreen'
import BudgetScreen from './screens/BudgetScreen'
import TransactionDetailsScreen from './screens/TransactionDetailsScreen'
import LoginScreen from './screens/LoginScreen'

function App() {
  return (
    <Router>
        
        <Header />
        
        <main className="py-3">
        <Container>
          <Routes>
          
            <Route  path="/" element={ <HomeScreen /> } />

            <Route  path="/transaction/:id" element={ <TransactionDetailsScreen /> } />

            <Route  path="/trends" element={ <TrendsScreen /> } />

            <Route  path="/networth" element={ <NetworthScreen /> } />

            <Route  path="/budget" element={ <BudgetScreen /> } />

            <Route path="/login" element={ <LoginScreen />} />

          </Routes>
        </Container>  
        </main>
  
        <Footer />
        
    </Router>
  );
}

export default App;

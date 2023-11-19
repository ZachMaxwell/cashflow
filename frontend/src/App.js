
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
import RegisterScreen from './screens/RegisterScreen'
import UserProfileScreen from './screens/UserProfileScreen'
import ProtectedRoute from './routing/ProtectedRoute'

function App() {
  return (
    <Router>
        
        <Header />
        
        <main className="py-3">
        <Container>
          <Routes>
          
            <Route element={ <ProtectedRoute /> }>
              <Route  path="/" element={ <HomeScreen /> } />
            </Route>

            <Route element={ <ProtectedRoute /> }>
              <Route  path="/transactions/:id" element={ <TransactionDetailsScreen /> } />
            </Route>

            <Route element={ <ProtectedRoute /> }>
              <Route  path="/trends" element={ <TrendsScreen /> } />
            </Route>

            <Route element={ <ProtectedRoute /> }>
              <Route  path="/networth" element={ <NetworthScreen /> } />
            </Route>

            <Route element={ <ProtectedRoute /> }> 
              <Route  path="/budget" element={ <BudgetScreen /> } />
            </Route>

            <Route path="/login" element={ <LoginScreen />} />

            <Route path="/register" element={ <RegisterScreen />} />

            <Route element={ <ProtectedRoute />}>
              <Route path="/user-profile" element={ <UserProfileScreen />} />
            </Route>
            
          </Routes>
        </Container>  
        </main>
  
        <Footer />
        
    </Router>
  );
}

export default App;

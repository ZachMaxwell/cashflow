import React from 'react'
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import BudgetTable from '../components/BudgetTable';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Loader from '../components/Loader';

function BudgetScreen() {

  return (
    <div>

      <h1 className='my-3'><strong>Budget</strong></h1>

      <BudgetTable />

    </div>
  )
}

export default BudgetScreen
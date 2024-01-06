import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'


function SearchBar({ onSearch }) {

    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        onSearch(keyword)
    }, [onSearch, keyword])

    const searchInputHandler = (e) => {
        e.preventDefault()
        let searchInput = e.target.value.toLowerCase()
        setKeyword(searchInput)
    }

    return (
        <Form className='mb-3'>
            <Form.Control
                type='text'
                onChange={ searchInputHandler }
                className='mr-sm-2 ml-sm-5'
                style={{ width: '30%', maxWidth: '300px' }}
                placeholder='Search for transactions...'
            />
        </Form>
    )
}

export default SearchBar;
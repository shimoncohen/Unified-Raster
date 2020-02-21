import React, { useEffect } from 'react';
import './App.css';
import Map from './Map/Map';
import Axios from 'axios';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();

  const getDataFromServer = async () => {
    // Get layers from the server and update store.
    try {
      const layers = await Axios.get('http://localhost:5000/layers');
      dispatch({ type: 'updateStore', payload: layers.data });
    }
    catch{
      alert('problem with server');
    }
  }

  useEffect(() => {
    getDataFromServer();
  }, [])

  return (
    <Map />
  );
}

export default App;

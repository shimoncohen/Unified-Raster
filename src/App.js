import React, { useEffect } from 'react';
import './App.css';
import Map from './Map/Map';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack'

function App() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const getDataFromServer = async () => {
    // Get layers from the server and update store.
    try {
      const layers = await Axios.get('http://localhost:5000/layers/');
      dispatch({ type: 'updateStore', payload: layers.data });
    }
    catch{
      enqueueSnackbar('There is a problem in our server, please try again later', { variant: 'error' });
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

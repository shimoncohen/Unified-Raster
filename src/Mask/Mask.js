import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button } from '@material-ui/core/'
import Done from '@material-ui/icons/Done'
import { useDispatch } from 'react-redux';


export default function Mask(props) {
    const [item1, setItem1] = useState({ error: false, helperText: '', value: props.item1 });
    const dispatch = useDispatch();

    const handleChangeItem1 = e => {
        debugger;
        if (e === '') {
            setItem1({ error: true, helperText: 'Can\'t be empty', value: e });
        }
        else
            setItem1({ error: false, helperText: '', value: e });
    }

    return (
        <div>
            <TextField
                error={item1.error}
                helperText={item1.helperText}
                value={item1.value}
                onChange={e => handleChangeItem1(e.target.value)}
                id="Item1"
                label="Item1"
                variant="outlined"
                fullWidth
                size='small'
            />
            
            <Button
                variant='contained'
                startIcon={<Done />}
                color="primary"
                onClick={() => console.log('ff')}
            >
                Update
               </Button>
        </div>
    );
}
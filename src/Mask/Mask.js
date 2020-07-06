import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Grid, RadioGroup, Radio, FormControlLabel, FormLabel,Switch } from '@material-ui/core/'
import Done from '@material-ui/icons/Done'
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    band: {
        justifyContent: 'space-around',
    },
});

export default function Mask(props) {
    const classes = useStyles();
    const [feather, setFeather] = useState({ error: false, helperText: '', value: 0 });
    const [holesize, setHolesize] = useState({ error: false, helperText: '', value: 0 });
    const [band, setBand] = useState('1');
    const [whiteFill, setWhiteFill] = useState(false);

    const dispatch = useDispatch();

    const handleChangeBand = e => {
        setBand(e.target.value);
    }

    const handleChangeWhiteFill = () => {
        setWhiteFill(!whiteFill);
    }

    const handleChangeFeather = e => {
        if (e === '') {
            setFeather({ error: true, helperText: 'Can\'t be empty', value: e });
        }
        if (['-', '+'].includes(e)) {
            setFeather({ error: false, helperText: '', value: 0 });
        }
        if (e > 255) {
            setFeather({ error: false, helperText: '', value: 255 });
        }
        else {
            setFeather({ error: false, helperText: '', value: e });
        }
    }

    const handleChangeHolesize = e => {
        if (e === '') {
            setHolesize({ error: true, helperText: 'Can\'t be empty', value: e });
        }
        if (['-', '+'].includes(e)) {
            setHolesize({ error: false, helperText: '', value: 0 });
        }
        if (e > 100000) {
            setHolesize({ error: false, helperText: '', value: 100000 });
        }
        else {
            setHolesize({ error: false, helperText: '', value: e });
        }
    }

    return (
        <div>
            <Grid
                container
                spacing={2}
                justify="space-evenly"
                alignItems="center">
                <Grid item xs={6}>
                    <FormLabel component="legend">Band</FormLabel>
                    <RadioGroup row aria-label="band" value={band} className={classes.band} onChange={handleChangeBand}>
                        <FormControlLabel value="0" control={<Radio />} label="Red" />
                        <FormControlLabel value="1" control={<Radio />} label="Green" />
                        <FormControlLabel value="2" control={<Radio />} label="Blue" />
                    </RadioGroup>
                </Grid>

                <Grid item xs={6}>
                <FormLabel component="legend">White fill</FormLabel>
                    <FormControlLabel
                        control={<Switch checked={whiteFill} onChange={handleChangeWhiteFill} name="whileFill" />}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        error={feather.error}
                        helperText={feather.helperText}
                        value={feather.value}
                        onChange={e => handleChangeFeather(e.target.value)}
                        id="feather"
                        label="Feather"
                        variant="outlined"
                        size='small'
                        type='number'
                        required={true}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        error={holesize.error}
                        helperText={holesize.helperText}
                        value={holesize.value}
                        onChange={e => handleChangeHolesize(e.target.value)}
                        id="holesize"
                        label="Holesize"
                        variant="outlined"
                        size='small'
                        type='number'
                        required={true}
                        fullWidth
                    />
                </Grid>
            </Grid>
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
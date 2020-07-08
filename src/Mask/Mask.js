import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Grid, RadioGroup, Radio, FormControlLabel, FormLabel, Switch } from '@material-ui/core/'
import Done from '@material-ui/icons/Done'
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles({
    band: {
        justifyContent: 'space-around',
    },
});

export default function Mask(props) {
    const classes = useStyles();
    const [feather, setFeather] = useState(0);
    const [holesize, setHolesize] = useState(0);
    const [band, setBand] = useState('1');
    const [whiteFill, setWhiteFill] = useState(false);
    const [sourceDate, setSourceDate] = useState(new Date());

    const dispatch = useDispatch();

    const handleChangeBand = e => {
        setBand(e.target.value);
    }

    const handleChangeWhiteFill = () => {
        setWhiteFill(!whiteFill);
    }

    const handleChangeSourceDate = date => {
        setSourceDate(date);
    }

    const handleChangeFeather = e => {
        if (e === '' || parseInt(e) < 0) {
            setFeather(0);
            return;
        }
        if (parseInt(e) > 255) {
            setFeather(255);
            return;
        }
        if (e.length > 1 && e[0] === '0') {
            let withoutZero = e.substring(1);
            setFeather(withoutZero);
            return;
        }
        setFeather(parseInt(e));

    }

    const handleChangeHolesize = e => {
        if (e === '' || parseInt(e) < 0) {
            setHolesize(0);
            return;
        }
        if (parseInt(e) > 100000) {
            setHolesize(100000);
            return;
        }
        if (e.length > 1 && e[0] === '0') {
            let withoutZero = e.substring(1);
            setHolesize(withoutZero);
            return;
        }
        setHolesize(parseInt(e));

    }

    return (
        <div>
            <Grid
                container
                spacing={5}
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

                <Grid item xs={2}>
                    <FormLabel component="legend">White fill</FormLabel>
                    <FormControlLabel
                        control={<Switch checked={whiteFill} onChange={handleChangeWhiteFill} name="whileFill" />}
                    />
                </Grid>

                <Grid item xs={4}>
                    <FormLabel component="legend">Source date</FormLabel>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            value={sourceDate}
                            onChange={handleChangeSourceDate}

                        />
                    </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={6}>
                    <FormLabel component="legend">Feather</FormLabel>
                    <TextField
                        value={feather}
                        onChange={e => handleChangeFeather(e.target.value)}
                        id="feather"
                        variant="outlined"
                        size='small'
                        type='number'
                        required={true}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormLabel component="legend">Hole size</FormLabel>
                    <TextField
                        value={holesize}
                        onChange={e => handleChangeHolesize(e.target.value)}
                        id="holesize"
                        variant="outlined"
                        size='small'
                        type='number'
                        required={true}
                        fullWidth
                    />
                </Grid>
            </Grid>
            {/* TODO: center button */}
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
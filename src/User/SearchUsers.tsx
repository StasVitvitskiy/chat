import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Box} from "@material-ui/core";
import {userStateSelector} from "./userSelectors";
import {useSelector} from "react-redux";

export default function SearchUsers() {
    const { userInfo } = useSelector(userStateSelector);
    const options: {text: string, value: string}[] = [];
    for( let key in userInfo) {
        options.push({text: `${userInfo[key].name} ${userInfo[key].lastName}`, value: key})
    }
    return (
        <Box>
            <Autocomplete
                getOptionLabel={option => option.text}
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Find Users"
                        margin="normal"
                        variant="outlined"
                        InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                )}
            />
        </Box>
    );
}
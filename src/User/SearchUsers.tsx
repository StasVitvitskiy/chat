import React, {useCallback} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Box} from "@material-ui/core";
import {userStateSelector} from "./userSelectors";
import {useDispatch, useSelector} from "react-redux";
import {openChat} from "../api";


export function SearchUsers() {
    const { userInfo, currentUser } = useSelector(userStateSelector);
    const options: {text: string, value: string}[] = [];
    for( let key in userInfo) {
        options.push({text: `${userInfo[key].name} ${userInfo[key].lastName}`, value: key})
    }
    const dispatch = useDispatch();
    const onUserSelected = useCallback((
        event, newValue
    ) => {
        if (currentUser) {
            dispatch(openChat(newValue.value, currentUser.uid))
        }
    }, [dispatch, currentUser])
    return (
        <Box>
            <Autocomplete
                getOptionLabel={option => option.text}
                freeSolo
                onChange={onUserSelected}
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
                        inputProps={{
                            ...params.inputProps,
                            value: ""
                        }}
                    />
                )}
            />
        </Box>
    );
}
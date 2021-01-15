import React, {ChangeEvent, SyntheticEvent, useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {personalInfoStateSelector} from "./personalInfoSelector";
import {Box, Button, TextField} from "@material-ui/core";
import {PersonalInfoState, sendPersonalInfo, setPersonalInfoField} from "./personalInfoReducer";
import {useHistory} from "react-router-dom";



export function PersonalInfo() {
    const {name,lastName} = useSelector(personalInfoStateSelector)
    const dispatch = useDispatch();
    const updateField = useCallback(
        (field: keyof PersonalInfoState) => (e: ChangeEvent<HTMLInputElement>)=> {
            dispatch(
                setPersonalInfoField(field,e.target.value)
            )
        },
        [dispatch]
    )
    const history = useHistory();

    const handleSubmit = useCallback(
        (e: SyntheticEvent) => {
            e.preventDefault();
            dispatch(
                sendPersonalInfo(name,lastName, history)
            )
        },
        [dispatch, history, lastName, name]
    )
    return (
        <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
            <Box component="form" display="grid" gridRowGap="10px" width='30%' onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    id='name'
                    variant='outlined'
                    label="Name"
                    value={name}
                    onChange={updateField("name")}
                    required
                />
                <TextField
                    fullWidth
                    id="lastName"
                    variant='outlined'
                    label="Last Name"
                    value={lastName}
                    onChange={updateField("lastName")}
                    required
                />
                <Box width='120px' display='grid' justifySelf='center'>
                    <Button variant='contained' color="primary" type='submit'>Submit</Button>
                </Box>
            </Box>
        </Box>
    )
}
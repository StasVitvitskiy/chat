import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Box} from "@material-ui/core";

export default function SearchUsers() {
    return (
        <Box>
            <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                options={users.map((option) => option.name + " " + option.lastName)}
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

// will be in redux
const users = [
    { name: 'John', lastName: "Johnson" },
    { name: 'Tyrone', lastName: "Spong" },
    { name: 'Jane', lastName: "Doe" },
    { name: 'Timothy', lastName: "Keller" },
    { name: 'Mike', lastName: "Taylor" },
    { name: 'Taylor', lastName: "Meyer" },
    { name: 'Courtney', lastName: "Plunk" },
    { name: 'Steve', lastName: "Fox" },
    { name: 'James', lastName: "Richardson" },
    { name: 'Vicki', lastName: "Dwira" },
];
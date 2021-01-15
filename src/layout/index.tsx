import React, {PureComponent} from "react";
import {Box, withStyles} from "@material-ui/core";

const styles = {
    root: {
        display:'grid',
        gridTemplateAreas: `
            "leftPanel rightPanel"
        `,
        height: "100vh",
        gridTemplateColumns: "1fr 4fr",
    },
    leftPanel: {
        gridArea: "leftPanel",
        display: "grid",
        gridTemplateAreas: `
            "upperPartLeft"
            "lowerPartLeft"
        `,
        gridTemplateRows: "80px 1fr"
    },
    leftPanelTop: {
        gridArea: "upperPartLeft",
        //backgroundColor: "red"
    },
    leftPanelBottom: {
        gridArea: "lowerPartLeft",
        backgroundColor: 'black'
    },
    rightPanel: {
        gridArea: "rightPanel",
        display: "grid",
        gridTemplateAreas: `
            "upperPartRight"
            "mainPartRight"
            "bottomPartRight"
        `,
        gridTemplateRows: "80px 1fr 80px"
    },
    rightPanelTop: {
        gridArea: "upperPartRight",
        backgroundColor: "blue"
    },
    rightMainPanel: {
        gridArea: "mainPartRight",
        backgroundColor: "purple"
    },
    rightPanelBottom: {
        gridArea: "bottomPartRight",
        backgroundColor: "brown"
    }
}

type Classes = { [field in keyof typeof styles]: string }

export const Layout = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}> {
    render() {
        const { classes } = this.props
        return(
            <Box className={classes.root}>
                {this.props.children}
            </Box>
        )
    }
})


export const LeftPanel = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}> {
    render() {
        const { classes } = this.props
        return(
            <Box className={classes.leftPanel}>
                {this.props.children}
            </Box>
        )
    }
})

export const LeftPanelTop = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}> {
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.leftPanelTop}>
                {this.props.children}
            </Box>
        )
    }
})

export const LeftPanelBottom = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}>{
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.leftPanelBottom}>
                {this.props.children}
            </Box>
        )
    }
})

export const RightPanel = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}> {
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.rightPanel}>
                {this.props.children}
            </Box>
        )
    }
})

export const RightPanelTop = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}>{
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.rightPanelTop}>
                {this.props.children}
            </Box>
        )
    }
})

export const RightPanelMain = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}>{
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.rightMainPanel}>
                {this.props.children}
            </Box>
        )
    }
})

export const RightPanelBottom = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}> {
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.rightPanelBottom}>
                {this.props.children}
            </Box>
        )
    }
})

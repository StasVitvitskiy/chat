import React, {PureComponent} from "react";
import {Box, withStyles} from "@material-ui/core";

const styles = {
    root: {
        display:'grid',
        gridTemplateAreas: `
            "headerLeft headerRight"
            "leftPanel rightPanel"
        `,
        height: "100vh",
        gridTemplateColumns: "1fr 4fr",
        gridTemplateRows: "50px 1fr"
    },
    leftPanel: {
        gridArea: "leftPanel",
        display: "grid",
        gridTemplateAreas: `
            "upperPartLeft"
            "lowerPartLeft"
        `,
        maxHeight: "calc(100vh - 50px)",
        gridTemplateRows: "80px 1fr"
    },
    headerLeft: {
        gridArea: "headerLeft",
        backgroundColor: "#4A7799"
    },
    headerRight: {
        gridArea: "headerRight",
        backgroundColor: "#4A7799"
    },
    leftPanelTop: {
        gridArea: "upperPartLeft",
    },
    leftPanelBottom: {
        gridArea: "lowerPartLeft",
        backgroundColor: 'black'
    },
    rightPanel: {
        gridArea: "rightPanel",
        display: "grid",
        gridTemplateAreas: `
            "mainPartRight"
            "bottomPartRight"
        `,
        maxHeight: "calc(100vh - 50px)",
        gridTemplateRows: "1fr 90px"
    },
    rightMainPanel: {
        gridArea: "mainPartRight",
        maxHeight:"100%",
        overflow: "scroll",
    },
    rightPanelBottom: {
        gridArea: "bottomPartRight",
        backgroundColor: "#e8e6e6"
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

export const LayoutHeaderLeft = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}>{
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.headerLeft}>
                {this.props.children}
            </Box>
        )
    }
})
export const LayoutHeaderRight = withStyles(styles)(class extends PureComponent<{
    classes: Classes
}>{
    render() {
        const { classes } = this.props
        return (
            <Box className={classes.headerRight}>
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

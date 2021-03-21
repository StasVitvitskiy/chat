import React, {PureComponent} from "react";
import {Box} from "@material-ui/core";
import {UserState, WithUserState} from "./userReducer";
import {connect} from "react-redux";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {auth} from "../firebase";
import {bindActionCreators, Dispatch} from "redux";
import {clearStateOnSignOut} from "../appActions";

export const UserHeader = connect(
    (state: WithUserState): UserState => state.user,
    (dispatch: Dispatch) => bindActionCreators({
        clearStateOnSignOut
    }, dispatch)
)(
    class extends PureComponent<UserState & {
        clearStateOnSignOut: typeof clearStateOnSignOut
    }
    > {
        handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
            this.setAnchorEl(event.currentTarget);
        };
        handleClose = () => {
            this.setAnchorEl(null);
        };
        setAnchorEl = (elem: null | SVGSVGElement) => {
            this.setState({
                anchorEl: elem
            })
        }
        signOut = async () => {
           await auth.signOut()
           this.props.clearStateOnSignOut()
        }
        state: {
            anchorEl: null | SVGSVGElement
        } = {
            anchorEl: null,
        }
        render() {
            const {currentUser, userInfo} = this.props;
            return (
                <Box
                    display='flex'
                    justifyContent='flex-start'
                    height='100%'
                    color='white'
                    alignItems='center'
                    paddingLeft='10px'
                >
                    <AccountCircleIcon
                        data-testid="account-icon"
                        style={{cursor: "pointer"}}
                        onClick={this.handleClick}
                        fontSize='large'
                    />
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchorEl}
                        keepMounted
                        open={Boolean(this.state.anchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem data-testid="sign-out" onClick={this.signOut}>
                            Sign Out
                        </MenuItem>
                    </Menu>
                    <Box paddingLeft='10px' fontSize='1.2rem'>
                        {(userInfo[String(currentUser?.uid)] || {}).name}
                    </Box>
                </Box>
            )
        }
    }
)
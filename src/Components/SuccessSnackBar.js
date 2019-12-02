import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import {CheckCircle, Close} from '@material-ui/icons';


const styles = ({
    anchorOriginTopRight: {
        top: "500",
        justifyContent: 'right',
    },
});

class SuccessSnackBar extends React.Component {

    static TransitionDown(props) {
        return <Slide {...props} direction="left"/>;
    };

    handleSnackbarClose = () => {
        this.props.callback();
    };

    render() {
        const {open, message} = this.props;
        return (
            <Snackbar style={{paddingTop: '42px'}}
                      open={open}
                      TransitionComponent={SuccessSnackBar.TransitionDown}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                      autoHideDuration={3000}
                      onClose={this.handleSnackbarClose}>
                <SnackbarContent
                    style={{backgroundColor: 'green'}}
                    message={
                        <span id="message-id">
                            <CheckCircle style={{padding: 4}}/>
                            {message}
                                    </span>
                    }
                    action={[<IconButton key="close" aria-label="Close" color="inherit"
                                         onClick={this.handleSnackbarClose}>
                        <Close/>
                    </IconButton>]}/>
            </Snackbar>
        );
    }
}

SuccessSnackBar.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
};

export default withStyles(styles)(SuccessSnackBar)
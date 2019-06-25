import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";

const styles = ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
});

class ActiveFilters extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                </div>
            </div>
        );
    }
}

ActiveFilters.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActiveFilters)